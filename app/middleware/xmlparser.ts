export default options => {
  return async function gzip(ctx, next) {
    const xmlparser = require('express-xml-bodyparser');
    const { request, response, } = ctx;
    return xmlparser(options)(request, response, next);
  };
};
