#!/usr/bin/env node
import { ARCH_MAPPING, PLATFORM_MAPPING } from "./constants/common";
import parsePackageJson from "./utils/parsePackageJson";

const getBinDir = (): string => {
  const cmd = process.cwd();
  const projectDir = cmd.split('/node_modules')[0];
  const localBinDir = `${projectDir}/node_modules/.bin`;
  return localBinDir;
};

const uninstall = () => {
  const file = parsePackageJson();
  const localBinDir = getBinDir();
  file?.removeBinaryFileFromLocal(localBinDir);
};

const install = async () => {
  const file = parsePackageJson();
  const thisTagRelease = await file?.getRepoRelease();
  if (thisTagRelease) {
    const localBinDir = getBinDir();
    const binaryFileName = `${file?.repoName}_${file?.version}_${PLATFORM_MAPPING[process.platform]}_${ARCH_MAPPING[process.arch]}.tar.gz`;
    const binaryFileRequestUrl = thisTagRelease.assets.filter(item => item.name === binaryFileName)[0]?.url;
    if (!binaryFileRequestUrl) {
      console.log(`No such file in this repo: ${binaryFileName}`);
      console.log('Repo Name: ', file?.repoName);
      console.log('Tag Name: ', file?.tagName || '');
      console.log('Version: ', file?.version);
      return;
    } else {
      file?.downloadBinaryToLocal(binaryFileRequestUrl, localBinDir, binaryFileName);
    }
  }
};

// Parse command line arguments and call the right method
const actions = {
  "install": install,
  "uninstall": uninstall
};

const argv = process.argv;
if (argv && argv.length > 2) {
  const cmd = process.argv[2];
  if (!actions[cmd]) {
      console.log("Invalid command to go-npm. `install` and `uninstall` are the only supported commands");
      process.exit(1);
  }

  actions[cmd](function(err: Error) {
      if (err) {
          console.error(err);
          process.exit(1);
      } else {
          process.exit(0);
      }
  });
}
