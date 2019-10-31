import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/api/home/index', controller.home.index);
  router.get('/api/home/fail', controller.home.fail);
};
