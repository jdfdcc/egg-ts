import { EggAppConfig, EggAppInfo, PowerPartial, Context } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_1572536577023_6811';

  config.middleware = [];

  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    security: {
      csrf: {
        enable: false,
      },
      xframe: {
        enable: false,
      },
    },
  };

  // 数据库设置 @todo 为什么没有密码验证
  config.mongoose = {
    url: 'mongodb://119.23.255.136/dev',
    options: {},
  };

  config.session = {
    key: 'SESSION_ID',
    maxAge: 60 * 10 * 1000, // 10 分钟
    // maxAge: 11000, // 10 秒
    httpOnly: true,
    encrypt: true,
    renew: true,
  };

  // 跨域设置
  config.cors = {
    credentials: true,
    origin: (ctx: Context) => {
      // console.log();
      return ctx.request.header.origin;
    }, // 匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.cluster = {
    listen: {
      path: '',
      port: 8989,
      hostname: '127.0.0.1',
    },
  };

  return {
    ...config,
    ...bizConfig,
  };
};
