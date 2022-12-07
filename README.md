## go2npm

Helps you integrate binary golang packages into npm, Automatically download the Golang's binary package that matches the user's operating system to npm.

Supports download from public and private Golang's repository binary files to local, enrich front-end tool chains.

### Usage

#### Step 1

Create an empty folder, and init it use npm.

```shell
npm init -y
```

Then update its information to the golang’s binary package info.

#### Step 2

Add a property to the package.json named  ‘go2npm’  like this:

```json
{
  ...
  "go2npm": {
    "username": "[value]",
    "repoName": "[value]",
    "tagName": "[value]",
    "version": "[value]",
    "githubToken": "[value]",
    "name": "[value]"
  }
  ...
}
```

Add two script commands to the package.json like this:

```json
{
  ...
  "script": {
    "postinstall": "go2npm install",
    "preuninstall": "go2npm uninstall"
  }
  ...
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
#### Step 3

Publish your npm app!

```shell
npm publish
```

#### Step 4

Download your npm package!

Use npm

```shell
npm install [your npm app name] [-g]
```

Use yarn

```shel
yarn add [your npm app name] [-g]
```