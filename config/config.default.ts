import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

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

  // 跨域设置
  config.cors = {
    credentials: true,
    origin: 'http://127.0.0.1:9528', // 匹配规则  域名+端口  *则为全匹配
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
