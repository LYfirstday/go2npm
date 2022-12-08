# go2npm
[中文](https://github.com/LYfirstday/go2npm/blob/master/README_CN.md)
## What is go2npm

Go2npm is a tool that helps you integrate golang binary packages into npm；when golang programs are packaged and compiled, they are usually cross-compiled, we should use different binary packages for different operating systems，go2npm will automatically match the corresponding binary package to the user's operating system，Download it to npm local or global dependencies, supports downloading binaries from public, private repositories.

## How to use go2npm

If, for example, you already have successfully released golang binary and have them managed in github.

And your golang binary names should follow this specification：
```text
{{username}}_{{version}}_{{platform}}_{{arch}}.tar.gz
```

If you use [goreleaser](https://github.com/goreleaser) package your program, it will automatically write each parameter.

### Step one

Create an empty folder and initialize it with the npm init command to make it an npm package

```shell
npm init -y
```
Change the data in package.json to information about the golang tool's info.

### Step two

Add a property to package.json called go2npm:
```json
{
  "go2npm": {
    "username": "[value]",
    "repoName": "[value]",
    "tagName": "[value]",
    "version": "[value]",
    "githubToken": "[value]",
    "name": "[value]"
  }
}
```

| Property    | Is required | Description                                                  |
| ----------- | :---------- | ------------------------------------------------------------ |
| username    | true        | Github account username                                      |
| repoName    | true        | Your golang repository's name                                |
| tagName     | true        | Which tag version do you want to download from the golong’s repository |
| version     | true        | Your golang release version which you want to download       |
| githubToken | false       | If your golang's repositry is private, need this value       |
| name        | true        | Golang's binary file name, the command use at npm            |

[How to create github token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### Step three

Add two commands to the script property in package.json, and add go2npm to the devDependencies:
```json
{
  "script": {
    "postinstall": "go2npm install",
    "preuninstall": "go2npm uninstall"
  },
  "devDependencies": {
    "go2npm": "^1.0.5"
  }
}
```

### Step four

Publish your npm app (includes the golang repository info), you can publish to the official platform or to your own private npm repository

```shell
npm publish
```

### Step five

Use npm to install and have fun with your golang application toolkit.

```shell
npm install [your npm app name] [-g]
```

Use yarn

```shell
yarn add [your npm app name] [-g]
```
