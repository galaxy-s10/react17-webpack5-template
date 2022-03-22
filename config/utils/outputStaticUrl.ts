export const APP_NAME = process.env.REACT_APP_RELEASE_PROJECT_NAME;
export const APP_ENV = process.env.REACT_APP_RELEASE_PROJECT_ENV;

/**
 * 项目最终会部署到该地址。
 * 如：project.hsslive.cn/react-webpack-template/
 * 如：project.hsslive.cn/beta/
 * 如：project.hsslive.cn/preview/
 * 如：project.hsslive.cn/prod/
 * 如：project.hsslive.cn/react-webpack-template/beta/
 * 如：project.hsslive.cn/react-webpack-template/preview/
 * 如：project.hsslive.cn/react-webpack-template/prod/
 */
export const outputStaticUrl = () => {
  if (APP_ENV === undefined && APP_NAME === undefined) {
    // npm run start的时候env和name都是undefined
    return '/';
  }
  if (APP_NAME === 'null') {
    return APP_ENV ? `/${APP_ENV}/` : '/'; // 如果没设置项目名称，则判断是否设置了项目环境，如果设置了，则返回/项目环境/，否则返回'/'
  }
  if (APP_ENV === 'null') {
    return APP_NAME ? `/${APP_NAME}/` : '/'; // 如果没设置项目环境，则判断是否设置了项目名称，如果设置了，则返回/项目名称/，否则返回'/'
  }
  return `/${APP_NAME}/${APP_ENV}/`; // 返回：/项目名称/项目环境/
};
