"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./../constants/common");
const githubRepo_1 = __importDefault(require("./githubRepo"));
const path = require('path');
const fs = require('fs');
const validateConfiguration = (packageJson) => {
    if (!packageJson.go2npm || typeof (packageJson.go2npm) !== "object") {
        return "'go2npm' property must be defined and be an object";
    }
    if (!packageJson.go2npm.username) {
        return "'username' property is necessary";
    }
    if (!packageJson.go2npm.name) {
        return "'name' property is necessary";
    }
    if (!packageJson.go2npm.repoName) {
        return "'repoName' property is required";
    }
    if (!packageJson.go2npm.version) {
        return "'version' property is required";
    }
    return '';
};
const parsePackageJson = () => {
    if (!(process.arch in common_1.ARCH_MAPPING)) {
        console.error("Installation is not supported for this architecture: " + process.arch);
        return;
    }
    if (!(process.platform in common_1.PLATFORM_MAPPING)) {
        console.error("Installation is not supported for this platform: " + process.platform);
        return;
    }
    const packageJsonPath = path.join(".", "package.json");
    if (!fs.existsSync(packageJsonPath)) {
        console.error("Unable to find package.json. " +
            "Please run this script at root of the package you want to be installed");
        return;
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
    const error = validateConfiguration(packageJson);
    if (error) {
        console.error("Invalid package.json: " + error);
        return;
    }
    return new githubRepo_1.default(packageJson.go2npm);
};
exports.default = parsePackageJson;
