import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import portfinder from 'portfinder';
import webpack from 'webpack';

import { chalkINFO, emoji } from './utils/chalkTip';
import { outputStaticUrl } from './utils/outputStaticUrl';

console.log(
  chalkINFO(`读取: ${__filename.slice(__dirname.length + 1)}`),
  emoji.get('white_check_mark')
);

export default new Promise((resolve) => {
  // 默认端口8000，如果被占用了，会自动递增+1
  const defaultPort = 8000;
  portfinder
    .getPortPromise({
      port: defaultPort, // 最小端口
      stopPort: 9000, // 最大端口
    })
    .then((port) => {
      console.log(chalkINFO(`当前webpack-dev-server使用的端口: ${port}`));
      resolve({
        target: 'web',
        mode: 'development',
        devtool: 'source-map',
        stats: 'errors-warnings', // 只显示警告和错误信息（webpack-dev-server4.x后变了）
        devServer: {
          client: {
            logging: 'none', // https://webpack.js.org/configuration/dev-server/#devserverclient
          },
          // stats: 'errors-warnings', // 只显示警告和错误信息
          // hot: true, // hrm，开启模块热替换
          // hotOnly: true, // 默认情况下（hotOnly:false），如果编译失败会刷新页面。设置了true后就不会刷新整个页面
          hot: 'only', // （webpack-dev-server4.x后变了）
          compress: true, // 开启gizp压缩
          port, // 默认端口号8080
          // open: true, // 默认不打开浏览器
          // historyApiFallback: true, // 默认值：false，设置true后可解决spa页面刷新404
          historyApiFallback: {
            rewrites: [
              // 如果publicPath设置了/abc，就不能直接设置historyApiFallback: true，这样会重定向到react-webpack-template根目录下的index.html
              // publicPath设置了/abc，就重定向到/abc，这样就可以了
              { from: outputStaticUrl(false), to: outputStaticUrl(false) },
            ],
          },
          /**
           * contentBase默认为package.json文件所在的根目录，即react-webpack-template目录
           * 打开localhost:8080/hss/demo.js,就会访问react-webpack-template目录下的hss目录下的demo.js。
           * 设置contentBase: path.resolve(__dirname, '../hss')后，打开localhost:8080/demo.js,即可访问react-webpack-template目录下的hss目录下的demo.js
           * 这个目录最好和copyWebpackPlugin插件目录一致
           */
          // contentBase: path.resolve(__dirname, '../public'),
          // watchContentBase: true, // 监听contenBase目录
          // publicPath: '/', // devServer的publicPath建议与output的publicPath一致
          static: {
            // （webpack-dev-server4.x后变了）
            directory: path.resolve(__dirname, '../public'),
            watch: true,
            publicPath: outputStaticUrl(false),
          },
          proxy: {
            '/api': {
              // target: 'https://www.zhengbeining.com/api/',  //默认：/api/type/pageList ===>https://www.zhengbeining.com/api/api/type/pageList
              target: 'http://42.193.157.44/api', // 默认：/api/type/pageList ===>https://www.zhengbeining.com/api/api/type/pageList
              secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
              /**
               * changeOrigin，是否修改请求地址的源
               * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
               * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
               */
              changeOrigin: true,
              pathRewrite: {
                '^/api': '', // 重写后：/api/type/pageList ===>https://www.zhengbeining.com/api/type/pageList
              },
            },
          },
        },
        plugins: [
          new webpack.ProvidePlugin({
            React: 'react', // 如果报错：React is not defined，则自动加载react
          }), // 自动加载，而不必模块import或require,https://webpack.js.org/plugins/provide-plugin/
          new ReactRefreshWebpackPlugin(),
        ],
      });
    })
    .catch((error) => {
      console.log(error);
    });
});
