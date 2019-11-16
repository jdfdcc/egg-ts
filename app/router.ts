import { Application } from 'egg';
import wechat from './routers/wechat';
import client from './routers/client';

const api = '/api';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  const { xmlparser } = middleware;

  // 公共接口
  router.post(`${api}/common/getList`, controller.common.getList);
  router.post(`${api}/common/save`, controller.common.save);
  router.post(`${api}/common/queryOne`, controller.common.queryOne);

  router.post(`${api}/order/queryList`, controller.order.queryList);
  router.post(`${api}/order/payresult`, xmlparser({ trim: false, explicitArray: false }), controller.order.payresult);

  // web pc 接口配置
  client(app, api);
  // 微信接口配置
  wechat(app, api);
};
