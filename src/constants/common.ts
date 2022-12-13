export const ARCH_MAPPING = {
  "ia32": "386",
  "x64": "amd64",
  "arm": "arm"
};

// Mapping between Node's `process.platform` to Golang's 
export const PLATFORM_MAPPING = {
  "darwin": "darwin",
  "linux": "linux",
  "win32": "windows",
  "freebsd": "freebsd"
};

export const GITHUB_API_PREFIX = 'https://api.github.com/repos';

export const FileUriSeparator = process.platform === 'win32' ? '\\' : '/';
