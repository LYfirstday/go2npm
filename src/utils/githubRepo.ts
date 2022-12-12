import { Go2npm, RepoReleaseList } from "./../types/common";
import { GITHUB_API_PREFIX } from "./../constants/common";
import axios from 'axios';
import request from 'request';
import zlib from 'zlib';
import tar from 'tar';
import fs from 'fs';
var ProgressBar = require('progress');

class GolangGithubRepo {
  username: string;
  repoName: string;
  githubToken: string | undefined;
  tagName: string | undefined;
  version: string;
  /** Is it private repo */
  isPrivate: boolean = false;
  name: string;

  jsonHeaders: {[key: string] : string};
  streamHeaders: {[key: string] : string};

  constructor(initData: Go2npm) {
    this.username = initData.username;
    this.repoName = initData.repoName;
    this.version = initData.version;
    this.name = initData.name;
    const jsonH = {
      "Accept": "application/json, text/plain; charset=UTF-8",
      "User-Agent": 'weeego'
    };
    const streamH = {
      "Accept": "application/octet-stream; charset=UTF-8",
      "User-Agent": 'weeego'
    };
    if (initData.githubToken) {
      this.githubToken = initData.githubToken;
      this.isPrivate = true;
      jsonH['Authorization'] = `Bearer ${initData.githubToken}`;
      streamH['Authorization'] = `Bearer ${initData.githubToken}`;
    }
    if (initData.tagName) {
      this.tagName = initData.tagName;
    }
    this.jsonHeaders = jsonH;
    this.streamHeaders = streamH;
  }

  getRepoRelease = async () => {
    const requestUrl = `${GITHUB_API_PREFIX}/${this.username}/${this.repoName}/releases`;
    const fetchRes = await axios.get<RepoReleaseList[]>(requestUrl, { headers: this.jsonHeaders });
    if (fetchRes.status === 200) {
      if (this.tagName) {
        return (fetchRes.data || []).filter(item => item.tag_name === this.tagName)[0];
      }
      return fetchRes.data[0] || {};
    } else {
      console.log('Error: ', fetchRes.statusText);
      return;
    }
  };

  downloadBinaryToLocal = async (requestUrl: string, targetPath: string, fileName: string) => {
    const _this = this;
    const ungz = zlib.createGunzip();
    const untar = tar.Extract({path: targetPath});

    untar.on('error', () => {
      console.log('Decompression failure: ', _this.name);
    });

    const req = request.get({
      uri: requestUrl,
      headers: this.streamHeaders
    });
    console.log('Downloading path ------>', targetPath);
    let bar: any;
    req.on('response', function(res) {
      const contentLen = Number(res.headers["content-length"] || 0);
      bar = new ProgressBar('downloading [:bar] :rate/bps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: contentLen
      });
      if (res.statusCode !== 200) return console.log("Error downloading binary. HTTP Status Code: " + res.statusCode);
      console.log('\n\r');
      console.log('Downloading the binary file: ', _this.name);
      req.pipe(ungz).pipe(untar);
    });
    req.on('data', res => {
      bar.tick(res.length);
    });
    req.on('error', (err) => {
      console.log('Request binary file error ', err || '');
    });
    req.on('complete', () => {
      console.log(`Download the ${_this.name} completed!`);
    });
  };

  removeBinaryFile = (binDir: string) => {
    console.log('Removing file: ', this.name);
    fs.unlink(`${binDir}/${this.name}`, err => {
      if (err) throw err;
      console.log('Uninstalled ', this.name);
    });
  }
}

export default GolangGithubRepo;
