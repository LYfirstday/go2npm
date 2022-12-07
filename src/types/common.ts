/** The go project github repo config */
export type GoBinary = {
  /** Github account username */
  username: string;
  /** The repo name, where the go project binary file is */
  repoName: string;
  /** Github auth token, if the go project is private */
  githubToken?: string;
  /**
   * This value determines which release tag of the golang's repo will downloaded.
   * If this value is not available, the latest tag version will be selected.
   * */
  tagName?: string;
  version: string;
  /** Golang's binary file name */
  name: string;
};

export type Assets = {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  content_type: string;
  state: string;
  size: number;
  browser_download_url: string;
};
export type RepoReleaseList = {
  url: string;
  id: number;
  assets_url: string;
  html_url: string;
  author: any;
  node_id: string;
  tag_name: string;
  name: string;
  assets: Assets[];
}