# 简介

基于React + Typescript + Webpack5 搭建的react项目模板，并主要使用了以下插件：

- react@17.x
- react-router-dom@6.x
- redux@4.x

# 运行

安装依赖：

```bash
yarn install
```

启动本地服务，默认运行在 `localhost:8000` 端口（如果 8000 端口被占用了,则往后+1,直到找到一个能用的端口）

```bash
yarn start
```

# 部署

> 以下依赖为cdn加载：

- @reduxjs/toolkit
- react
- react-dom
- react-redux
- react-router-dom
- redux

```bash
yarn build
```

# package.json

1. 写jsx/tsx的时候，如果需要style、className等智能提示，则需要安装：@types/react
2. lint-staged，执行一些操作，如：prettier、eslint
3. husky，git钩子
   1. pre-commit，在git commit前执行lint-staged
   2. commit-msg，在git commit后执行commitlint
4. commitizen，执行git cz的时候可规范进行提交commit
5. @commitlint/cli，@commitlint/config-conventional，对git commit的提交信息进行约束
6. standard-version，更新changeLog.md以及package.json的version。

# 注意

当前运行的node版本：v14.17.0



