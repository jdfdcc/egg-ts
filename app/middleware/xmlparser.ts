export default options => {
  return async function gzip(ctx, next) {
    const xmlparser = require('express-xml-bodyparser');
    const { req, res, } = ctx;
    return xmlparser(options)(req, res, next);
  };
};
