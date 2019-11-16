
module.exports = () => {
  return async (ctx, next) => {
    console.log('weqweqweqeqweq----ewq-ewq-e-qwe-qw-', ctx);
    const bodyParser = require('body-parser');
    ctx.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    await next();
  };
};
