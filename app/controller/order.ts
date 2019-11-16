
import { Controller } from 'egg';
import { success, fail } from '../utils/handler';

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
    const { ctx } = this;
    console.log('ctx.req', ctx.req);
    // tslint:disable-next-line:no-string-literal
    console.log('ctx.req.body', ctx.req['body'].xml);
    // tslint:disable-next-line:no-string-literal
    console.log('ctx.req.rawBody', ctx.req['rawBody']);
    console.log('ctx.request.body', ctx.request.body);
    const jsonData = ctx.request.body.xml;
    if (jsonData.result_code === 'SUCCESS') {
      console.log('i m ok');
    }

  }
}
