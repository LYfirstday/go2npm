"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinDirWhenInstall = void 0;
const getGlobalBinDirPath_1 = require("./getGlobalBinDirPath");
const getLocalBinDirPath_1 = require("./getLocalBinDirPath");
const getBinDirWhenInstall = () => {
    const { npm_config_argv } = process.env;
    // we don't know if the user installing to locally or globally,
    // so, we use the npm_config_argv value to get the install argv,
    console.log('Into npm_config_argv ------->', npm_config_argv);
    console.log('Local bin dir path -------> ', (0, getLocalBinDirPath_1.getLocalBinDirPath)());
    console.log('Global bin dir path ------->', (0, getGlobalBinDirPath_1.getGlobalBinDirPath)());
    if (npm_config_argv &&
        (npm_config_argv.includes('--global') ||
            npm_config_argv.includes('-g') ||
            npm_config_argv.includes('-G'))) {
        return (0, getGlobalBinDirPath_1.getGlobalBinDirPath)();
    }
    return (0, getLocalBinDirPath_1.getLocalBinDirPath)();
};
exports.getBinDirWhenInstall = getBinDirWhenInstall;
