"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalBinDirPath = void 0;
const common_1 = require("./../constants/common");
// Get the dir path where the npm command called
const getLocalBinDirPath = () => {
    const cmd = process.cwd();
    console.log('cmd ---------> ', cmd);
    const projectDir = cmd.split(`${common_1.FileUriSeparator}node_modules`)[0];
    const localBinDir = `${projectDir}${common_1.FileUriSeparator}node_modules${common_1.FileUriSeparator}.bin`;
    return localBinDir;
};
exports.getLocalBinDirPath = getLocalBinDirPath;
