import { Application } from 'egg';
const api = '/api';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  // 公共接口
  router.get(`${api}/common/getList`, controller.common.getList);
  router.post(`${api}/common/save`, controller.common.save);
  router.post(`${api}/common/delete`, controller.common.delete);
  router.get(`${api}/home/index`, controller.home.success);
  router.get(`${api}/home/fail`, controller.home.fail);

  // 订单接口
  router.get(`${api}/order/index`, controller.order.fail);

  // -------------------- 微信相关--------------------
  // 微信登录接口 解析code
  router.post(`${api}/wx/wxlogin`, controller.wechat.wxLogin);
  // 解析数据 解析用户的手机号码
  router.post(`${api}/wx/decrypt`, middleware.auth(), controller.wechat.decryptData);
};
