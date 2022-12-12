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
const tar_1 = __importDefault(require("tar"));
const fs_1 = __importDefault(require("fs"));
var ProgressBar = require('progress');
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
        this.downloadBinaryToLocal = (requestUrl, targetPath, fileName) => __awaiter(this, void 0, void 0, function* () {
            const _this = this;
            const ungz = zlib_1.default.createGunzip();
            const untar = tar_1.default.Extract({ path: targetPath });
            untar.on('error', () => {
                console.log('Decompression failure: ', _this.name);
            });
            const req = request_1.default.get({
                uri: requestUrl,
                headers: this.streamHeaders
            });
            console.log('Downloading path ------>', targetPath);
            let bar;
            req.on('response', function (res) {
                const contentLen = Number(res.headers["content-length"] || 0);
                bar = new ProgressBar('downloading [:bar] :rate/bps :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: contentLen
                });
                if (res.statusCode !== 200)
                    return console.log("Error downloading binary. HTTP Status Code: " + res.statusCode);
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
        });
        this.removeBinaryFile = (binDir) => {
            console.log('Removing file: ', this.name);
            fs_1.default.unlink(`${binDir}/${this.name}`, err => {
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
}
exports.default = GolangGithubRepo;
