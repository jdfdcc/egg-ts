
import { Controller } from 'egg';
import { success, fail } from '../utils/handler';

export default class OrderController extends Controller {

  /**
   * 查询订单列表
   */
  async queryList() {
    const { ctx } = this;
    const { request } = ctx;
    const result = await ctx.service.order.queryList(request.body);
    ctx.body = success(result);
  }

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

  // 退款接口
  async refund() {
    const { ctx } = this;
    const { request } = ctx;
    const result = await ctx.service.wechat.WxPayRefund(request.body.id);
    ctx.body = success(result);
  }

  /**
   * 微信支付成功的回掉地址
   * { appid: 'wxcb03144d55fc82c4',
   * bank_type: 'CFT',
   * cash_fee: '1',
   * fee_type: 'CNY',
   * is_subscribe: 'N',
   * mch_id: '1515299391',
   * nonce_str: 'fk8udswk5an',
   * openid: 'o2ns348BXkxgVfINjJlYCNPpgwxY',
   * out_trade_no: 'O_NO_1573892637360_38Ni',
   * result_code: 'SUCCESS',
   * return_code: 'SUCCESS',
   * sign: '6BCFEBF756D71DC02F47F7882CA9CE5A',
   * time_end: '20191116162426',
   * total_fee: '1',
   * trade_type: 'JSAPI',
   * transaction_id: '4200000422201911163433748485' }
   *
   *
   * <xml>
   *   <return_code><![CDATA[SUCCESS]]></return_code>
   *   <return_msg><![CDATA[OK]]></return_msg>
   * </xml>
   */
  async payresult() {
    const { ctx } = this;
    // tslint:disable-next-line:no-string-literal
    console.log('ctx.req.body', ctx.req['body'].xml);
    // tslint:disable-next-line:no-string-literal
    const result = ctx.req['body'].xml;
    if (result.result_code === 'SUCCESS') {
      const { out_trade_no } = result;
      try {
        const result1 = await ctx.service.order.paySuccess(out_trade_no, result);
        console.log('微信支付回调成功', result1);
        ctx.body = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
      } catch (error) {
        ctx.body = '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
      }
    }
  }
}
