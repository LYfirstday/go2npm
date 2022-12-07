
// Get the dir path where the npm command called
export const getLocalBinDirPath = () => {
  const cmd = process.cwd();
  const projectDir = cmd.split('/node_modules')[0];
  const localBinDir = `${projectDir}/node_modules/.bin`;
  return localBinDir;
};
