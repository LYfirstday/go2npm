"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalBinDirPath = void 0;
const getGlobalBinDirPath = () => {
    var _a;
    const nodeBin = (_a = process.env.NODE) === null || _a === void 0 ? void 0 : _a.split('bin')[0];
    return `${nodeBin}bin`;
};
exports.getGlobalBinDirPath = getGlobalBinDirPath;
