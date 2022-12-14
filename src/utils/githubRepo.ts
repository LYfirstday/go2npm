import { Go2npm, RepoReleaseList } from "./../types/common";
import { FileUriSeparator, GITHUB_API_PREFIX } from "./../constants/common";
import axios from 'axios';
import request from 'request';
import zlib from 'zlib';
import fs from 'fs';
import tarStream from 'tar-stream';
import tar from 'tar';
import ProgressBar from 'progress';

const windowsBinContent = (name: string) => {
  return `
    #!/usr/bin/env node
    const path = require('path');
    const process = require('process');

    function executor() {
      const exec = require('child_process').exec;
      const args = process.argv;
      const params = args.splice(2).join(' ');
      const url = path.resolve(__dirname, './node_modules/.bin/${name}.exe' + params);
      exec(url, function(err, out) {
        if (err) {
          return console.log(err);
        }
        console.log(out);
      });
    }

    executor();
  `;
};

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
      "User-Agent": 'wego'
    };
    const streamH = {
      "Accept": "application/octet-stream; charset=UTF-8",
      "User-Agent": 'wego'
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

  downloadBinaryToLocal = async (requestUrl: string, targetPath: string, isGlobal: boolean) => {
    const _this = this;
    const ungz = zlib.createGunzip();
    const os = process.platform;
    let extract: any;

    if (os === 'win32') {
      extract = tarStream.extract();
      /** save the golang binary file data */
      let chunks = Buffer.from([]);
      /** save the binary name */
      let exeName = '';
      extract.on('entry', function(header, stream, cb) {
        exeName = header.name;
        stream.on('data', function(chunk) {
          chunks = Buffer.concat([chunks, Buffer.from(chunk)]);
        });
  
        stream.on('end', function() {
          cb();
        });
  
        stream.resume();
      });
  
      extract.on('finish', function() {
        fs.writeFile(`${targetPath}${FileUriSeparator}${exeName}`, chunks, { flag: 'a' }, (err) => {
          console.log('Write file error: ', err);
        });
      });
    } else {
      extract = tar.Extract({ path: targetPath, newer: true });
    }

    const req = request.get({
      uri: requestUrl,
      headers: this.streamHeaders
    });
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
      req.pipe(ungz).pipe(extract);
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

    if (os === 'win32' && !isGlobal) {
      const filename = `${targetPath}\\${_this.name}`;
      fs.writeFile(filename, windowsBinContent(_this.name), {flag: 'a'}, (err) => {
        if (err) {
          console.log('Error: ', err);
        }
      })
    }
  };

  removeBinaryFile = (binDir: string) => {
    console.log('Removing file: ', this.name);
    fs.unlink(`${binDir}${FileUriSeparator}${this.name}`, err => {
      if (err) throw err;
      console.log('Uninstalled ', this.name);
    });
  }
}

export default GolangGithubRepo;
