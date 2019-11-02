export default () => {
  return async function gzip(ctx, next) {
    const { header } = ctx;
    console.log('我是微信登陆拦截器', header.code);
    if (ctx.session.sessionKey) {
      await next();
    } else {
      ctx.body = {
        code: '101',
        error: '请先登录',
      };
      return;
    }
  };
};
