# go2npm

## go2npm是什么

go2npm是一个帮助你将golang二进制程序包集成到npm的一个工具；golang程序在打包编译的时候，通常会交叉编译，不同操作系统使用不同的二进制包，go2npm会根据用户的操作系统，自动匹配对应的二进制包，将其下载到npm本地或全局依赖中，支持从公共、私有仓库中下载二进制文件。

## 如何使用go2npm

假如，你已经有了成功发布的golang二进制程序包，并且将它们放在了github仓库中管理

你的golang程序包名称应该遵循这样的规范：
```text
{{name}}_{{version}}_{{platform}}_{{arch}}.tar.gz
```

如果你使用 [goreleaser](https://github.com/goreleaser) 打包你的程序，它会自动将各个参数写好并发布。

### 第一步

创建一个空的文件夹，并且使用npm init命令初始化，使其成为npm包

```shell
npm init -y
```
将package.json中的数据更改为golang工具的相关信息

### 第二步

向package.json中增加一个属性，名为go2npm:
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
| username    | true        | Github账户名称                                                 |
| repoName    | true        | golang仓库名称                                                 |
| tagName     | true        | golang程序包发布时设置的tag值                                    |
| version     | true        | golang程序发布时的版本号       |
| githubToken | false       | 如果你的golang仓库是私有的，需要填写这个属性值用于请求仓库文件读的权限      |
| name        | true        | golang二进制包名，也就是在npm中使用时需要调用的命令名            |

[如何创建github token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### 第三步

向package.json中script属性添加两个命令，并且将go2npm添加在devDependencies中：
```json
{
  "script": {
    "postinstall": "go2npm install",
    "preuninstall": "go2npm uninstall"
  },
  "devDependencies": {
    "go2npm": "^1.2.9"
  }
}
```

### 第四步

发布你的npm包(承载着golang仓库数据的npm包)，你可以发布到官方平台或者你自己私有npm仓库中

```shell
npm publish
```

### 第五步

使用npm下载，并且愉快的开始使用你的golang程序工具包

```shell
npm install [your npm app name] [-g]
```

Use yarn

```shell
yarn add [your npm app name] [-g]
```

如果安装到本地npm依赖，执行:
```shell
npx [binary-name] [options]
```

如果安装到全局依赖中，执行:
```shell
[binary-name] [options]
```

## license
MIT