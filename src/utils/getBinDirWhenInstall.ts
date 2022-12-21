import { getGlobalBinDirPath } from "./getGlobalBinDirPath";
import { getLocalBinDirPath } from "./getLocalBinDirPath";

export const getBinDirWhenInstall = (): { path: string; isGlobal: boolean; } => {
  const { npm_config_argv } = process.env;
  // we don't know if the user installing to locally or globally,
  // so, we use the npm_config_argv value to get the install argv,
  if (
    npm_config_argv &&
      (npm_config_argv.includes('--global') ||
       npm_config_argv.includes('-g') ||
       npm_config_argv.includes('-G') ||
       npm_config_argv.includes('global')
      )) {
    return {
      path: getGlobalBinDirPath(),
      isGlobal: true,
    };
  }
  return {
    path: getLocalBinDirPath(),
    isGlobal: false,
  };
};
