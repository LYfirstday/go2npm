import { FileUriSeparator } from "./../constants/common";

// Get the dir path where the npm command called
export const getLocalBinDirPath = () => {
  const cmd = process.cwd();
  console.log('cmd ---------> ', cmd);
  const projectDir = cmd.split(`${FileUriSeparator}node_modules`)[0];
  const localBinDir = `${projectDir}${FileUriSeparator}node_modules${FileUriSeparator}.bin`;
  return localBinDir;
};
