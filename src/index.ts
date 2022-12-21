#!/usr/bin/env node
import { ARCH_MAPPING, FileUriSeparator, PLATFORM_MAPPING } from "./constants/common";
import { getBinDirWhenInstall } from "./utils/getBinDirWhenInstall";
import { getGlobalBinDirPath } from "./utils/getGlobalBinDirPath";
import { getLocalBinDirPath } from "./utils/getLocalBinDirPath";
import parsePackageJson from "./utils/parsePackageJson";
import fs from 'fs';

const uninstall = () => {
  const file = parsePackageJson();
  const localBinDirPath = getLocalBinDirPath();
  const globalBinDirPath = getGlobalBinDirPath();
  fs.access(`${localBinDirPath}${FileUriSeparator}${file?.name}`, fs.constants.F_OK, err => {
    if (err) {
      fs.access(`${globalBinDirPath}${FileUriSeparator}${file?.name}`, fs.constants.F_OK, error => {
        if (!error) {
          file?.removeBinaryFile(globalBinDirPath);
        }
      });
    } else {
      file?.removeBinaryFile(localBinDirPath);
    }
  });
};

const install = async () => {
  const golangRepo = parsePackageJson();
  const thisTagRelease = await golangRepo?.getRepoRelease();
  if (thisTagRelease) {
    const localBinDir = getBinDirWhenInstall();
    const binaryFileName = `${golangRepo?.name}_${golangRepo?.version}_${PLATFORM_MAPPING[process.platform]}_${ARCH_MAPPING[process.arch]}.tar.gz`;
    const binaryFileRequestUrl = thisTagRelease.assets.filter(item => item.name === binaryFileName)[0]?.url;
    if (!binaryFileRequestUrl) {
      console.log(`No such file in this repo: ${binaryFileName}`);
      console.log('Repo Name: ', golangRepo?.repoName);
      console.log('Tag Name: ', golangRepo?.tagName || '');
      console.log('Version: ', golangRepo?.version);
      return;
    } else {
      golangRepo?.downloadBinaryToLocal(binaryFileRequestUrl, localBinDir.path, localBinDir.isGlobal);
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
      console.log("Invalid command to go2npm. `install` and `uninstall` are the only supported commands");
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
