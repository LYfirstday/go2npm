export const getGlobalBinDirPath = (): string => {
  const os = process.platform;
  if (os === 'win32') {
    const nodePath = process.env.NODE?.split('\\node.exe')[0];
    return `${nodePath}\\`;
  } else {
    const nodeBin = process.env.NODE?.split('bin')[0];
    return `${nodeBin}bin`;
  }
};