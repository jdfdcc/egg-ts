import { Application } from 'egg';

export default (app: Application, api: string) => {
  const { controller, router, middleware } = app;
  const { auth } = middleware;
  // 微信登录接口 解析code
  router.post(`${api}/wx/user/login`, controller.wechat.wechat.wxLogin);
  // 解析数据 解析用户的手机号码
  router.post(`${api}/wx/user/decrypt`, auth('WX'), controller.wechat.wechat.decryptData);
  router.get(`${api}/wx/user/info`, auth('WX'), controller.wechat.wechat.userInfo);
  // 支付
  // router.post(`${api}/wx/pay`, auth('WX'), controller.wechat.pay);
  router.post(`${api}/wx/order/create`, auth('WX'), controller.order.create);
  router.post(`${api}/wx/order/pay`, auth('WX'), controller.order.payOrder);

  // 商城相关的接口配置
  router.post(`${api}/wx/shop/list`, auth('WX'), controller.wechat.shop.queryList);
  router.get(`${api}/wx/shop/detail`, auth('WX'), controller.wechat.shop.queryDetail);
};
