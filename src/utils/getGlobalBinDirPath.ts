export const getGlobalBinDirPath = (): string => {
  const nodeBin = process.env.NODE?.split('bin')[0];
  return `${nodeBin}bin`;
};