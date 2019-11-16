
import { Controller } from 'egg';
import { success, fail } from '../utils/handler';
import xml2js from 'xml2js';

export default class OrderController extends Controller {

  /**
   * 创建订单
   */
  async create() {
    const { ctx } = this;
    const { request } = ctx;
    const { shopId, priceId } = request.body;
    if (!shopId) {
      ctx.body = fail('请先现在商品');
      return;
    } else if (!priceId) {
      ctx.body = fail('请选择购买商品的价格');
      return;
    }

    const result = await ctx.service.order.create(request.body);
    if (result) {
      ctx.body = success(result);
    } else {
      ctx.body = fail('创建订单失败');
    }
  }

  /**
   * 支付订单
   */
  async payOrder() {
    const { ctx } = this;
    const { request } = ctx;
    const { orderId } = request.body;
    if (!orderId) {
      ctx.body = fail('订单ID不能为空');
      return;
    }
    // 支付订单
    const result = await ctx.service.order.pay(orderId);
    if (result) {
      ctx.body = success(result);
    } else {
      ctx.body = fail('创建订单失败');
    }
  }

  /**
   * 微信支付成功的回掉地址
   */
  async payresult() {
    let data = '';
    const { ctx } = this;
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', chunk => {
      data += chunk;
    });
    ctx.req.on('end', () => {
      xml2js(data, { explicitArray: false }, (err, json) => {
        console.log('json', json); // 这里的json便是xml转为json的内容
        ctx.body = 'success';
      });
    });

  }
}
