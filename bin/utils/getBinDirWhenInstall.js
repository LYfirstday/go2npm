"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinDirWhenInstall = void 0;
const getGlobalBinDirPath_1 = require("./getGlobalBinDirPath");
const getLocalBinDirPath_1 = require("./getLocalBinDirPath");
const getBinDirWhenInstall = () => {
    const { npm_config_argv } = process.env;
    // we don't know if the user installing to locally or globally,
    // so, we use the npm_config_argv value to get the install argv,
    if (npm_config_argv &&
        (npm_config_argv.includes('--global') ||
            npm_config_argv.includes('-g') ||
            npm_config_argv.includes('-G') ||
            npm_config_argv.includes('global'))) {
        return {
            path: (0, getGlobalBinDirPath_1.getGlobalBinDirPath)(),
            isGlobal: true,
        };
    }
    return {
        path: (0, getLocalBinDirPath_1.getLocalBinDirPath)(),
        isGlobal: false,
    };
};
exports.getBinDirWhenInstall = getBinDirWhenInstall;
