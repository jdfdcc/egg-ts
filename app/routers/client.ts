import { Application } from 'egg';

export default (app: Application, api: string) => {
  const { controller, router, middleware } = app;
  const { auth } = middleware;
  // 微信登录接口 解析code
  router.post(`${api}/client/login`, controller.client.client.login);
  router.get(`${api}/client/user/info`, auth('client'), controller.client.client.userInfo);
};
