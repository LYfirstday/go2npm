"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./../constants/common");
const axios_1 = __importDefault(require("axios"));
const request_1 = __importDefault(require("request"));
const zlib_1 = __importDefault(require("zlib"));
const fs_1 = __importDefault(require("fs"));
const tar_stream_1 = __importDefault(require("tar-stream"));
const progress_1 = __importDefault(require("progress"));
const windowsBinContent = (name) => {
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
    constructor(initData) {
        /** Is it private repo */
        this.isPrivate = false;
        this.getRepoRelease = () => __awaiter(this, void 0, void 0, function* () {
            const requestUrl = `${common_1.GITHUB_API_PREFIX}/${this.username}/${this.repoName}/releases`;
            const fetchRes = yield axios_1.default.get(requestUrl, { headers: this.jsonHeaders });
            if (fetchRes.status === 200) {
                if (this.tagName) {
                    return (fetchRes.data || []).filter(item => item.tag_name === this.tagName)[0];
                }
                return fetchRes.data[0] || {};
            }
            else {
                console.log('Error: ', fetchRes.statusText);
                return;
            }
        });
        this.downloadBinaryToLocal = (requestUrl, targetPath, isGlobal) => __awaiter(this, void 0, void 0, function* () {
            const _this = this;
            const ungz = zlib_1.default.createGunzip();
            const extract = tar_stream_1.default.extract();
            /** save the golang binary file data */
            let chunks = Buffer.from([]);
            /** save the binary name */
            let exeName = '';
            extract.on('entry', function (header, stream, cb) {
                exeName = header.name;
                stream.on('data', function (chunk) {
                    chunks = Buffer.concat([chunks, Buffer.from(chunk)]);
                });
                stream.on('end', function () {
                    cb();
                });
                stream.resume();
            });
            extract.on('finish', function () {
                fs_1.default.writeFile(`${targetPath}${common_1.FileUriSeparator}${exeName}`, chunks, { flag: 'a' }, (err) => {
                    console.log('Write file error: ', err);
                });
            });
            const req = request_1.default.get({
                uri: requestUrl,
                headers: this.streamHeaders
            });
            let bar;
            req.on('response', function (res) {
                const contentLen = Number(res.headers["content-length"] || 0);
                bar = new progress_1.default('downloading [:bar] :rate/bps :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: contentLen
                });
                if (res.statusCode !== 200)
                    return console.log("Error downloading binary. HTTP Status Code: " + res.statusCode);
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
            const os = process.platform;
            if (os === 'win32' && !isGlobal) {
                const filename = `${targetPath}\\${_this.name}`;
                fs_1.default.writeFile(filename, windowsBinContent(_this.name), { flag: 'a' }, (err) => {
                    if (err) {
                        console.log('Error: ', err);
                    }
                });
            }
        });
        this.removeBinaryFile = (binDir) => {
            console.log('Removing file: ', this.name);
            fs_1.default.unlink(`${binDir}${common_1.FileUriSeparator}${this.name}`, err => {
                if (err)
                    throw err;
                console.log('Uninstalled ', this.name);
            });
        };
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
}
exports.default = GolangGithubRepo;
