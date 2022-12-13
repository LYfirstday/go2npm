#!/usr/bin/env node
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
const common_1 = require("./constants/common");
const getBinDirWhenInstall_1 = require("./utils/getBinDirWhenInstall");
const getGlobalBinDirPath_1 = require("./utils/getGlobalBinDirPath");
const getLocalBinDirPath_1 = require("./utils/getLocalBinDirPath");
const parsePackageJson_1 = __importDefault(require("./utils/parsePackageJson"));
const fs_1 = __importDefault(require("fs"));
const uninstall = () => {
    const file = (0, parsePackageJson_1.default)();
    const localBinDirPath = (0, getLocalBinDirPath_1.getLocalBinDirPath)();
    const globalBinDirPath = (0, getGlobalBinDirPath_1.getGlobalBinDirPath)();
    fs_1.default.access(`${localBinDirPath}${common_1.FileUriSeparator}${file === null || file === void 0 ? void 0 : file.name}`, fs_1.default.constants.F_OK, err => {
        if (err) {
            fs_1.default.access(`${globalBinDirPath}${common_1.FileUriSeparator}${file === null || file === void 0 ? void 0 : file.name}`, fs_1.default.constants.F_OK, error => {
                if (!error) {
                    file === null || file === void 0 ? void 0 : file.removeBinaryFile(globalBinDirPath);
                }
            });
        }
        else {
            file === null || file === void 0 ? void 0 : file.removeBinaryFile(localBinDirPath);
        }
    });
};
const install = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const golangRepo = (0, parsePackageJson_1.default)();
    const thisTagRelease = yield (golangRepo === null || golangRepo === void 0 ? void 0 : golangRepo.getRepoRelease());
    if (thisTagRelease) {
        const localBinDir = (0, getBinDirWhenInstall_1.getBinDirWhenInstall)();
        const binaryFileName = `${golangRepo === null || golangRepo === void 0 ? void 0 : golangRepo.repoName}_${golangRepo === null || golangRepo === void 0 ? void 0 : golangRepo.version}_${common_1.PLATFORM_MAPPING[process.platform]}_${common_1.ARCH_MAPPING[process.arch]}.tar.gz`;
        const binaryFileRequestUrl = (_a = thisTagRelease.assets.filter(item => item.name === binaryFileName)[0]) === null || _a === void 0 ? void 0 : _a.url;
        if (!binaryFileRequestUrl) {
            console.log(`No such file in this repo: ${binaryFileName}`);
            console.log('Repo Name: ', golangRepo === null || golangRepo === void 0 ? void 0 : golangRepo.repoName);
            console.log('Tag Name: ', (golangRepo === null || golangRepo === void 0 ? void 0 : golangRepo.tagName) || '');
            console.log('Version: ', golangRepo === null || golangRepo === void 0 ? void 0 : golangRepo.version);
            return;
        }
        else {
            golangRepo === null || golangRepo === void 0 ? void 0 : golangRepo.downloadBinaryToLocal(binaryFileRequestUrl, localBinDir, binaryFileName);
        }
    }
});
// Parse command line arguments and call the right method
const actions = {
    "install": install,
    "uninstall": uninstall
};
const argv = process.argv;
if (argv && argv.length > 2) {
    const cmd = process.argv[2];
    if (!actions[cmd]) {
        console.log("Invalid command to go2npm. `install` and `uninstall` are the only supported commands");
        process.exit(1);
    }
    actions[cmd](function (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        else {
            process.exit(0);
        }
    });
}
