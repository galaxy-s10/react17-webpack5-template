import { execSync } from 'child_process';

import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import { default as CopyWebpackPlugin } from 'copy-webpack-plugin';
// import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { DefinePlugin, Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import WebpackBar from 'webpackbar';

import pkg from '../../package.json';
import InjectProjectInfoPlugin from '../InjectProjectInfoPlugin';
import { outputDir } from '../constant';
import { chalkINFO, chalkWARN } from '../utils/chalkTip';
import { outputStaticUrl } from '../utils/outputStaticUrl';
import { resolveApp } from '../utils/path';
import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';

let commitHash;
let commitUserName;
let commitDate;
let commitMessage;
try {
  // commit哈希
  commitHash = execSync('git show -s --format=%H').toString().trim();
  // commit用户名
  commitUserName = execSync('git show -s --format=%cn').toString().trim();
  // commit日期
  commitDate = new Date(
    execSync(`git show -s --format=%cd`).toString()
  ).toLocaleString();
  // commit消息
  commitMessage = execSync('git show -s --format=%s').toString().trim();
} catch (error) {
  console.log(error);
}

console.log(chalkINFO(`读取: ${__filename.slice(__dirname.length + 1)}`));

const sassRules = (isProduction: boolean, module?: boolean) => {
  return [
    isProduction
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: outputStaticUrl(isProduction),
          },
        }
      : {
          loader: 'style-loader',
          options: {
            // sourceMap: false,
          },
        },
    {
      loader: 'css-loader', // 默认会自动找postcss.config.js
      options: {
        importLoaders: 2, // https://www.npmjs.com/package/css-loader#importloaders
        sourceMap: false,
        modules: module
          ? {
              localIdentName: '[name]_[local]_[hash:base64:5]',
            }
          : undefined,
      },
    },
    {
      loader: 'postcss-loader', // 默认会自动找postcss.config.js
      options: {
        sourceMap: false,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: false,
        // modules: module
        //   ? {
        //       localIdentName: '[name]_[local]_[hash:base64:5]',
        //     }
        //   : undefined,
      },
    },
  ].filter(Boolean);
};

const commonConfig = (isProduction) => {
  const result: Configuration = {
    entry: {
      main: {
        import: './src/index.tsx',
      },
    },
    output: {
      clean: true, // 在生成文件之前清空 output 目录。替代clean-webpack-plugin
      filename: 'js/[name]-[contenthash:6]-bundle.js', // 入口文件打包生成后的文件的文件名
      /**
       * 入口文件中，符合条件的代码，被抽离出来后生成的文件的文件名
       * 如：动态(即异步)导入，默认不管大小，是一定会被单独抽离出来的。
       * 如果一个模块既被同步引了，又被异步引入了，不管顺序（即不管是先同步引入再异步引入，还是先异步引入在同步引入），
       * 这个模块会打包进bundle.js，而不会单独抽离出来。
       */
      chunkFilename: 'js/[name]-[contenthash:6]-bundle-chunk.js',
      path: resolveApp(`./${outputDir}`),
      assetModuleFilename: 'assets/[name]-[contenthash:6].[ext]', // 静态资源生成目录（不管什么资源默认都统一生成到这里,除非单独设置了generator）
      /**
       * webpack-dev-server 也会默认从 publicPath 为基准，使用它来决定在哪个目录下启用服务，来访问 webpack 输出的文件。
       * 所以不管开发模式还是生产模式，output.publicPath都会生效，
       * output的publicPath建议(或者绝大部分情况下必须)与devServer的publicPath一致。
       * 如果不设置publicPath，它默认就约等于output.publicPath:""，到时候不管开发还是生产模式，最终引入到
       * index.html的所有资源都会拼上这个路径，如果不设置output.publicPath，会有问题：
       * 比如vue的history模式下，如果不设置output.publicPath，如果路由全都是/foo,/bar,/baz这样的一级路由没有问题，
       * 因为引入的资源都是js/bundle.js，css/bundle.css等等，浏览器输入：http://localhost:8080/foo，回车访问，
       * 引入的资源就是http://localhost:8080/js/bundle.js，http://localhost:8080/css/bundle.css，这些资源都
       * 是在http://localhost:8080/根目录下的没问题，但是如果有这些路由：/logManage/logList,/logManage/logList/editLog，
       * 等等超过一级的路由，就会有问题，因为没有设置output.publicPath，所以它默认就是""，此时浏览器输入：
       * http://localhost:8080/logManage/logList回车访问，引入的资源就是http://localhost:8080/logManage/logList/js/bundle.js，
       * 而很明显，我们的http://localhost:8080/logManage/logList/js目录下没有bundle.js这个资源（至少默认情况下是没有，除非设置了其他属性）
       * 找不到这个资源就会报错，这种情况的路由是很常见的，所以建议默认必须手动设置output.publicPath:"/"，这样的话，
       * 访问http://localhost:8080/logManage/logList，引入的资源就是：http://localhost:8080/js/bundle.js，就不会报错。
       * 此外，output.publicPath还可设置cdn地址。
       */
      publicPath: outputStaticUrl(isProduction),
    },
    resolve: {
      // 解析路径
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 解析扩展名
      alias: {
        '@': resolveApp('./src'), // 设置路径别名
        script: resolveApp('./script'), // 设置路径别名
      },
      fallback: {
        /**
         * webpack5移除了nodejs的polyfill，更专注于web了？
         * 其实webpack5之前的版本能用nodejs的polyfill，也是
         * 和nodejs正统的api不一样，比如path模块，nodejs的path，
         * __dirname是读取到的系统级的文件绝对路径的（即/user/xxx）
         * 但在webpack里面使用__dirname，读取到的是webpack配置的绝对路径/
         * 可能有用的polyfill就是crypto这些通用的模块，类似path和fs这些模
         * 块其实都是他们的polyfill都是跑着浏览器的，只是有这些api原本的一些功能，
         * 还是没有nodejs的能力，所以webpack5干脆就移除了这些polyfill，你可以通过
         * 安装他们的polyfill来实现原本webpack4之前的功能，但是即使安装他们的polyfill
         * 也只是实现api的功能，没有他们原本在node的能力
         */
        // path: require.resolve('path-browserify'),
      },
    },
    resolveLoader: {
      // 用于解析webpack的loader
      modules: ['node_modules'],
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        // https://webpack.js.org/configuration/cache/#cacheallowcollectingmemory
        // 建议cache.buildDependencies.config: [__filename]在您的 webpack 配置中设置以获取最新配置和所有依赖项。
        config: [__filename],
      },
    },
    module: {
      // loader执行顺序：从下往上，从右往左
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            // 'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  !isProduction && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                cacheDirectory: true,
                cacheCompression: false, // https://github.com/facebook/create-react-app/issues/6846
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            isProduction
              ? {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    /**
                     * you can specify a publicPath here, by default it uses publicPath in webpackOptions.output
                     * 即默认打包的css文件是webpackOptions.output的publicPath，
                     * 但在new MiniCssExtractPlugin()时候，设置了打包生成的文件在dist下面的css目录里，
                     */
                    publicPath: '../',
                  },
                }
              : { loader: 'style-loader' }, // Do not use style-loader and mini-css-extract-plugin together.
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1, // 在css文件里面@import了其他资源，就回到上一个loader，在上一个loader那里重新解析@import里的资源
                modules: {
                  mode: 'local',
                  localIdentName: '[path][name]__[local]--[hash:base64:5]', // https://webpack.js.org/loaders/css-loader/#localidentname
                }, // css模块化
              },
            },
            'postcss-loader', // 默认会自动找postcss.config.js
          ],
          sideEffects: true, // 告诉webpack是有副作用的，不对css进行删除
        },
        {
          test: /\.(sass|scss)$/,
          // https://juejin.cn/post/6847902222873788430#heading-0
          oneOf: [
            {
              // 匹配：import './aaa.scss?module';
              resourceQuery: /module/,
              use: sassRules(isProduction, true),
            },
            {
              // 匹配：import './aaa.module.scss';
              test: /\.module\.\w+$/,
              use: sassRules(isProduction, true),
            },
            {
              // 匹配：import './aaa.scss';
              use: sassRules(isProduction),
              // use: (info) => {
              //   console.log(info);
              //   return sassRules(isProduction);
              // },
            },
          ],
          sideEffects: true,
        },
        // {
        //   test: /\.module\.(sass|scss)$/,
        //   use: [
        //     isProduction
        //       ? {
        //           loader: MiniCssExtractPlugin.loader,
        //           options: {
        //             publicPath: '../',
        //           },
        //         }
        //       : { loader: 'style-loader' },
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         importLoaders: 2,
        //         modules: {
        //           mode: 'local',
        //           localIdentName: '[path][name]__[local]--[hash:base64:5]',
        //         },
        //       },
        //     },
        //     'postcss-loader',
        //     { loader: 'sass-loader' },
        //   ],
        //   sideEffects: true,
        // },
        {
          test: /\.(jpg|jpeg|png|gif|svg)$/,
          type: 'asset',
          generator: {
            filename: 'img/[name]-[contenthash:6][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中
            },
          },
        },
        {
          test: /\.(eot|ttf|woff2?)$/,
          type: 'asset/resource',
          generator: {
            filename: 'font/[name]-[contenthash:6][ext]',
          },
        },
      ],
    },
    plugins: [
      // 构建进度条
      new WebpackBar(),
      // 友好的显示错误信息在终端
      new FriendlyErrorsWebpackPlugin(),
      // eslint
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        emitError: false, // 发现的错误将始终发出，禁用设置为false.
        emitWarning: false, // 找到的警告将始终发出，禁用设置为false.
        failOnError: false, // 如果有任何错误，将导致模块构建失败，禁用设置为false
        failOnWarning: false, // 如果有任何警告，将导致模块构建失败，禁用设置为false
        cache: true,
        cacheLocation: resolveApp('./node_modules/.cache/.eslintcache'),
      }),
      // 该插件将为您生成一个HTML5文件，其中包含使用脚本标签的所有Webpack捆绑包
      new HtmlWebpackPlugin({
        filename: 'index.html',
        title: 'react17-webpack5-template',
        template: './public/index.html',
        hash: true,
        minify: isProduction
          ? {
              collapseWhitespace: true, // 折叠空白
              keepClosingSlash: true, // 在单标签上保留末尾斜杠
              removeComments: true, // 移除注释
              removeRedundantAttributes: true, // 移除多余的属性（如：input的type默认就是text，如果写了type="text"，就移除它，因为不写它默认也是type="text"）
              removeScriptTypeAttributes: true, // 删除script标签中type="text/javascript"
              removeStyleLinkTypeAttributes: true, // 删除style和link标签中type="text/css"
              useShortDoctype: true, // 使用html5的<!doctype html>替换掉之前的html老版本声明方式<!doctype>
              // 上面的都是production模式下默认值。
              removeEmptyAttributes: true, // 移除一些空属性，如空的id,classs,style等等，但不是空的就全删，比如<img alt />中的alt不会删。http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_or_blank_attributes

              minifyCSS: true, // 使用clean-css插件删除 CSS 中一些无用的空格、注释等。
              minifyJS: true, // 使用Terser插件优化
            }
          : false,
        chunks: ['main'], // 要仅包含某些块，您可以限制正在使用的块
      }),
      // 注入项目信息
      new InjectProjectInfoPlugin({
        isProduction,
      }),
      // 将已存在的单个文件或整个目录复制到构建目录。
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public', // 复制public目录的文件
            // to: 'assets', //复制到output.path下的assets，不写默认就是output.path根目录
            globOptions: {
              ignore: [
                // 复制到output.path时，如果output.paht已经存在重复的文件了，会报错：
                // ERROR in Conflict: Multiple assets emit different content to the same filename md.html
                '**/index.html', // 忽略from目录下的index.html，它是入口文件
              ],
            },
          },
        ],
      }),
      // 定义全局变量
      new DefinePlugin({
        BASE_URL: `${JSON.stringify(outputStaticUrl(isProduction))}`, // public下的index.html里面的icon的路径
        'process.env': {
          NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
          PUBLIC_PATH: JSON.stringify(outputStaticUrl(isProduction)),
          REACT_APP_RELEASE_PROJECT_NAME: JSON.stringify(
            process.env.REACT_APP_RELEASE_PROJECT_NAME
          ),
          REACT_APP_RELEASE_PROJECT_ENV: JSON.stringify(
            process.env.REACT_APP_RELEASE_PROJECT_ENV
          ),
          REACT_APP_RELEASE_PROJECT_LASTBUILD: JSON.stringify(
            new Date().toLocaleString()
          ),
          REACT_APP_RELEASE_PROJECT_PACKAGE: JSON.stringify({
            name: pkg.name,
            version: pkg.version,
            repository: pkg.repository.url,
          }),
          REACT_APP_RELEASE_PROJECT_GIT: JSON.stringify({
            commitHash,
            commitDate,
            commitUserName,
            commitMessage,
          }),
        },
      }),
      process.env.WEBPACK_ANALYZER_SWITCH &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          generateStatsFile: true,
          statsOptions: { source: false },
        }), // configuration.plugins should be one of these object { apply, … } | function
    ].filter(Boolean),
  };
  return result;
};

export default (env) => {
  return new Promise((resolve) => {
    const isProduction = env.production;
    process.env.NODE_ENV = isProduction ? 'production' : 'development';
    const configPromise = Promise.resolve(
      isProduction ? prodConfig : devConfig
    );
    configPromise.then(
      (config: any) => {
        // 根据当前环境，合并配置文件
        const mergeConfig = merge(commonConfig(isProduction), config);
        console.log(
          chalkWARN(
            `根据当前环境，合并配置文件，当前是: ${process.env.NODE_ENV!}环境`
          )
        );
        resolve(mergeConfig);
      },
      (err) => {
        console.log(err);
      }
    );
  });
};
