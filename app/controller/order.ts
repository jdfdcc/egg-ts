
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
    const { request } = this.ctx;
    const jsonData = request.body.xml;
    if (jsonData.result_code === 'SUCCESS') {
      console.log('success:jsonData----', jsonData);
      // const key = 'c24cb4054b87951ee24dc736c67b94ca';
      // const stringA = 'appid=' + jsonData.appid + '&bank_type=' + jsonData.bank_type + '&cash_fee=' + jsonData.cash_fee + '&fee_type=' + jsonData.fee_type +
      //   '&is_subscribe=' + jsonData.is_subscribe + '&mch_id=' + jsonData.mch_id + '&nonce_str=' + jsonData.nonce_str + '&openid=' +
      //   jsonData.openid + '&out_trade_no=' + jsonData.out_trade_no + '&result_code=' + jsonData.result_code + '&return_code=' +
      //   jsonData.return_code + '&time_end=' + jsonData.time_end + '&total_fee=' + jsonData.total_fee + '&trade_type=' +
      //   jsonData.trade_type + '&transaction_id=' + jsonData.transaction_id;
      // const stringSignTemp = stringA + '&key=' + key;
      // const sign = md5(stringSignTemp).toUpperCase();
      // console.log(sign);
      // if (sign === jsonData.sign) {
      //   console.log('yes');
      //   // test.updatemsg(jsonData.out_trade_no).then(function (data) {
      //   //   // console.log(data)
      //   //   console.log('success');
      //   // });
      //   // json转xml
      //   // tslint:disable-next-line:only-arrow-functions
      //   const json2Xml = function (json) {
      //     let _xml = '';
      //     Object.keys(json).map(key => {
      //       _xml += `<${key}>${json[key]}</${key}>`;
      //     });
      //     return `<xml>${_xml}</xml>`;
      //   };
      //   const sendData = {
      //     return_code: 'SUCCESS',
      //     return_msg: 'OK',
      //   };
      //   // response. .send(json2Xml(sendData));
      //   this.ctx.body = json2Xml(sendData);
      // }
    } else {
      console.log('fail----', jsonData);
    }
  }
}
