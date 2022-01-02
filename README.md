# 简介

基于 webpack5 + react 搭建脚手架环境

# 运行

默认运行在 `localhost:8000` 端口（如果 8000 端口被占用了,则往后+1,直到找到一个能用的端口）

```bash
yarn start
```

# 部署

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



