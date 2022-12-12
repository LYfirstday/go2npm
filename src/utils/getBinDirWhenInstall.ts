import { getGlobalBinDirPath } from "./getGlobalBinDirPath";
import { getLocalBinDirPath } from "./getLocalBinDirPath";

export const getBinDirWhenInstall = (): string => {
  const { npm_config_argv } = process.env;
  // we don't know if the user installing to locally or globally,
  // so, we use the npm_config_argv value to get the install argv,
  console.log('Into npm_config_argv ------->', npm_config_argv);
  console.log('Local bin dir path -------> ', getLocalBinDirPath());
  console.log('Global bin dir path ------->', getGlobalBinDirPath());
  if (
    npm_config_argv &&
      (npm_config_argv.includes('--global') ||
       npm_config_argv.includes('-g') ||
       npm_config_argv.includes('-G')
      )) {
    return getGlobalBinDirPath();
  }
  return getLocalBinDirPath();
};
