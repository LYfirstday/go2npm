import { Go2npm } from "./../types/common";
import { ARCH_MAPPING, PLATFORM_MAPPING } from "./../constants/common";
import GolangGithubRepo from "./githubRepo";
const path = require('path');
const fs = require('fs');

/** PackageJson type, just define the type what you need */
type PackageJsonConfig = {
  go2npm: Go2npm;
  [key: string]: any;
};

const validateConfiguration = (packageJson: PackageJsonConfig) => {
  if (!packageJson.go2npm || typeof(packageJson.go2npm) !== "object") {
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
}

const parsePackageJson = (): GolangGithubRepo | undefined => {
  if (!(process.arch in ARCH_MAPPING)) {
    console.error("Installation is not supported for this architecture: " + process.arch);
    return;
  }

  if (!(process.platform in PLATFORM_MAPPING)) {
    console.error("Installation is not supported for this platform: " + process.platform);
    return;
  }

  const packageJsonPath = path.join(".", "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error("Unable to find package.json. " +
        "Please run this script at root of the package you want to be installed");
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath)) as PackageJsonConfig;
  const error = validateConfiguration(packageJson);
  if (error) {
    console.error("Invalid package.json: " + error);
    return;
  }

  return new GolangGithubRepo(packageJson.go2npm);
}


export default parsePackageJson;
