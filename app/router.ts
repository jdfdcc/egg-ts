import { Application } from 'egg';

const api = '/api';

export default (app: Application) => {
  const { controller, router } = app;
// 公共接口
  router.get(`${api}/common/getList`, controller.common.getList);
  router.post(`${api}/common/save`, controller.common.save);
  router.post(`${api}/common/delete`, controller.common.delete);

  router.get(`${api}/home/index`, controller.home.success);
  router.get(`${api}/home/fail`, controller.home.fail);
  router.get(`${api}/order/index`, controller.order.fail);
};
