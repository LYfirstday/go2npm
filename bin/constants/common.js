"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUriSeparator = exports.GITHUB_API_PREFIX = exports.PLATFORM_MAPPING = exports.ARCH_MAPPING = void 0;
exports.ARCH_MAPPING = {
    "ia32": "386",
    "x64": "amd64",
    "arm": "arm"
};
// Mapping between Node's `process.platform` to Golang's 
exports.PLATFORM_MAPPING = {
    "darwin": "darwin",
    "linux": "linux",
    "win32": "windows",
    "freebsd": "freebsd"
};
exports.GITHUB_API_PREFIX = 'https://api.github.com/repos';
exports.FileUriSeparator = process.platform === 'win32' ? '\\' : '/';
