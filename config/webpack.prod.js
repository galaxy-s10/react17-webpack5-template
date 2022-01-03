const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin'); // 注入script或link
const TerserPlugin = require('terser-webpack-plugin');

const { _INFO, emoji } = require('./utils/chalkTip');

// const PurgeCssPlugin = require('purgecss-webpack-plugin');// css的Tree Shaking
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin'); // 弃用，使用html-webpack-tags-plugin代替
// const glob = require('glob')
// const webpack = require('webpack');

console.log(
  _INFO(`读取：${__filename.slice(__dirname.length + 1)}`),
  emoji.get('white_check_mark')
);

module.exports = {
  mode: 'production',
  devtool: false,
  externals: {
    // 左边是import的包名，右边是全局变量
    react: 'React', // cdn引入的https://unpkg.com/react@17/umd/react.production.min.js导出的全局变量叫: React，其实就是umd的名称。
    'react-dom': 'ReactDOM', // cdn引入的https://unpkg.com/react-dom@17/umd/react-dom.production.min.js叫: ReactDOM
    history: 'HistoryLibrary',
    'react-router': 'ReactRouter',
    'react-router-dom': 'ReactRouterDOM', // react-router-dom依赖react-router和history
    redux: 'Redux',
    'react-redux': 'ReactRedux',
    '@reduxjs/toolkit': 'RTK',
  },
  optimization: {
    // concatenateModules: true,  // production模式下默认true。告知 webpack 去寻找模块图形中的片段，哪些是可以安全地被合并到单一模块中。
    usedExports: true, // production模式或者不设置usedExports，它默认就是true。usedExports的目的是标注出来哪些函数是没有被使用 unused，会结合Terser进行处理
    minimize: true, // 是否开启Terser,默认就是true，设置false后，不会压缩和转化
    minimizer: [
      new TerserPlugin({
        parallel: true, // 使用多进程并发运行以提高构建速度
        extractComments: false, // 去除打包生成的bundle.js.LICENSE.txt
        terserOptions: {
          // Terser 压缩配置
          parse: {
            // default {},如果希望指定其他解析选项，请传递一个对象。
          },
          compress: {
            // default {},传递false表示完全跳过压缩。传递一个对象来指定自定义压缩选项。
            arguments: true, // default: false,尽可能将参数[index]替换为函数参数名
            dead_code: true, // 删除死代码，默认就会删除，实际测试设置false也没用，还是会删除
            toplevel: false, // default: false,在顶级作用域中删除未引用的函数("funcs")和/或变量("vars"), 设置true表示同时删除未引用的函数和变量
            keep_classnames: false, // default: false,传递true以防止压缩器丢弃类名
            keep_fnames: false, // default: false,传递true以防止压缩器丢弃函数名
          },
          /**
           * mangle,默认值true,会将keep_classnames,keep_fnames,toplevel等等mangle options的所有选项设为true。
           * 传递false以跳过篡改名称，或者传递一个对象来指定篡改选项
           */
          mangle: true,
          toplevel: true, // default false,如果希望启用顶级变量和函数名修改,并删除未使用的变量和函数,则设置为true。
          keep_classnames: true, // default: undefined,传递true以防止丢弃或混淆类名。
          keep_fnames: true, // default: false,传递true以防止函数名被丢弃或混淆。
        },
      }),
      new CssMinimizerPlugin({
        parallel: true, // 使用多进程并发执行，提升构建速度。
      }), // css压缩，去除无用的空格等等
    ],
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  plugins: [
    new HtmlWebpackTagsPlugin({
      append: false,
      publicPath: '', // 默认会拼上output.publicPath，因为我们引入的是cdn的地址，因此不需要拼上output.publicPath，直接publicPath:''，这样就约等于拼上空字符串''
      // links: ['https://cdn.jsdelivr.net/npm/iview@3.5.4/dist/styles/iview.css'],
      scripts: [
        { path: 'https://unpkg.com/react@17/umd/react.production.min.js' },
        {
          path: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
        },
        {
          path: 'https://unpkg.com/history@5.2.0/umd/history.production.min.js',
        },
        {
          path: 'https://unpkg.com/react-router@6.2.1/umd/react-router.production.min.js',
        },
        {
          path: 'https://unpkg.com/react-router-dom@6.2.1/umd/react-router-dom.production.min.js',
        },
        {
          path: 'https://unpkg.com/redux@4.1.2/dist/redux.min.js',
        },
        {
          path: 'https://unpkg.com/react-redux@7.2.6/dist/react-redux.min.js',
        },
        {
          path: 'https://unpkg.com/@reduxjs/toolkit@1.7.1/dist/redux-toolkit.umd.min.js',
        },
      ],
    }),
    // new webpack.optimize.ModuleConcatenationPlugin(), //作用域提升。！！！在使用cdn时，axios和iview有问题，先不用！！！
    // new PurgeCssPlugin({
    //   /**
    //    * 实际测试很多bug,比如html里面有ul这个元素，css里面的.ul{}，#ul{}，ul{}都会打包进去？？？
    //    * 在js文件里如果有给元素添加类，但是注释了，如：// divEle.className='test123'，但是这个.test123一样会打包进去，得手动删除这行代码才行！
    //    */
    //   paths: glob.sync(`${path.resolve(__dirname, '../src')}/**/*`, { nodir: true }),
    //   safelist: function () {
    //     return {
    //       standard: ["body", "html"]
    //     }
    //   }
    // }),
    new CompressionPlugin({
      // http压缩
      test: /\.(css|js)$/i,
      threshold: 10 * 1024, // 大于10k的文件才进行压缩
      minRatio: 0.8, // 只有压缩比这个比率更好的资产才会被处理(minRatio =压缩大小/原始大小),即压缩如果达不到0.8就不会进行压缩
      algorithm: 'gzip', // 压缩算法
    }),
    // new PreloadWebpackPlugin({
    //   // 预加载
    //   rel: 'preload',
    //   include: 'initial',
    //   fileBlacklist: [/\.map$/, /hot-update\.js$/],
    // }),
    // new PreloadWebpackPlugin({
    //   // 预获取
    //   rel: 'prefetch',
    //   include: 'asyncChunks',
    // }),
  ],
};
