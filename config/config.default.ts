import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1572536577023_6811';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
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

  config.mongoose = {
    url: 'mongodb://119.23.255.136/dev',
    options: {},
  };

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

// export const mongoose = {
//   url: 'mongodb://127.0.0.1/demo',
//   options: {},
// };
