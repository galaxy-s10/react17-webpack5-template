const { _INFO, emoji } = require('./config/utils/chalkTip');

console.log(
  _INFO(`读取：${__filename.slice(__dirname.length + 1)}`),
  emoji.get('white_check_mark')
);

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        /**
         * useBuiltIns:
         * false: 默认值就是false,不用任何的polyfill相关的代码
         * usage: 代码中需要哪些polyfill, 就引用相关的api
         * entry: 手动在入口文件中导入 core-js/regenerator-runtime, 根据目标浏览器引入所有对应的polyfill
         */
        // useBuiltIns: 'entry',
        // useBuiltIns: 'usage',
        // useBuiltIns: false,
        corejs: 3,
      },
    ],
    ['@babel/preset-react'],
  ],
  plugins: [
    // [
    //   '@babel/plugin-transform-runtime', // 和@babel/preset-env的useBuiltIns二选一。
    //   {
    //     corejs: 3,
    //   },
    // ],
    // "react-hot-loader/babel", //使用react-hot-loader需要配置的，但是现在不用它了
  ],
};
