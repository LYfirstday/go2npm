"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalBinDirPath = void 0;
const getGlobalBinDirPath = () => {
    var _a, _b;
    const os = process.platform;
    if (os === 'win32') {
        const nodePath = (_a = process.env.NODE) === null || _a === void 0 ? void 0 : _a.split('\\node.exe')[0];
        return `${nodePath}\\`;
    }
    else {
        const nodeBin = (_b = process.env.NODE) === null || _b === void 0 ? void 0 : _b.split('bin')[0];
        return `${nodeBin}bin`;
    }
};
exports.getGlobalBinDirPath = getGlobalBinDirPath;
