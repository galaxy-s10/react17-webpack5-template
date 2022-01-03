###
# @Author: shuisheng
# @Email: 2274751790@qq.com
# @Github: https://github.com/galaxy-s10
# @Date: 2022-01-03
# @Description:https://github.com/galaxy-s10/react-webpack-template
###
ENV=$1
echo 全局安装yarn:
npm i yarn -g
echo 查看yarn版本:
yarn -v
echo 删除node_modules:
rm -rf node_modules
echo 开始安装依赖：
yarn install
echo 执行构建命令：
yarn build:$ENV
