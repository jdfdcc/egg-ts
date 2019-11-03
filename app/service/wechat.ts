import { Service } from 'egg';
import { appId, appSecret, decryptData, mchId, mchkey, remoteAddress, wxurl } from '../utils/wechat';
import { uuid } from '../utils/tools';
import wxpay from '../utils/wxTools';

export default class WeChatService extends Service {
  /**
   * @param code 获取code
   */
  async jscode2session(code) {
    const { ctx } = this;
    const result = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, {
      dataType: 'json',
      timeout: 3000,
    });

    const { openid, session_key } = result.data;

    // 解析成功
    if (openid) {
      // 创建用户
      const tempUser = {
        uuid: uuid(),
        type: 1,
        openId: openid,
      };
      const user = await this.ctx.service.user.update(tempUser);
      ctx.session.sessionKey = session_key;
      ctx.session.code = code;
      ctx.session.userInfo = user;
    }
    return result;
  }

  /**
   * 解析接口
   */
  async decryptData(params) {
    const { encryptedData, iv } = params;
    if (!this.ctx.session.sessionKey) {
      return '请先登录';
    }
    const result = await decryptData(encryptedData, iv, this.ctx.session.sessionKey);
    if (!result) {
      return '解析失败';
    }
    const { avatarUrl, openId, nickName, phoneNumber } = result;
    // 用户信息入库
    let user;
    if (openId) {
      user = {
        uuid: uuid(),
        userName: nickName,
        avatar: avatarUrl,
        extra: result,
        type: 1,
        openId,
      };
    } else {
      user = {
        openId: this.ctx.session.userInfo.openId,
        phone: phoneNumber,
      };
    }
    const tempUser = await this.ctx.service.user.update(user);
    // 更新换成的微信用户信息
    this.ctx.session.userInfo = tempUser;
    return result;
  }

  /**
   * 微信支付
   */
  async pay(params) {
    const { ctx } = this;
    // 首先拿到前端传过来的参数
    const orderCode = 'SH321312';
    const money = '0.01';
    const orderID = '321312';
    const openid = params.openId;

    console.log('APP传过来的参数是', orderCode + '----' + money + '------' + orderID + '----' + appId + '-----' + appSecret + '-----' + mchId + '-----' + mchkey);

    // 首先生成签名sign
    // appid
    const mch_id = mchId;
    const nonce_str = wxpay.createNonceStr();
    const timestamp = wxpay.createTimeStamp();
    const body = '测试微信支付';
    const out_trade_no = orderCode;
    const total_fee = wxpay.getmoney(money);
    const spbill_create_ip = remoteAddress; // 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
    const notify_url = wxurl;
    const trade_type = 'JSAPI';  // 'APP';公众号：'JSAPI'或'NATIVE'

    const sign = await wxpay.paysignjsapi(appId, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey);

    console.log('sign==', sign);

    // 组装xml数据
    let formData = '<xml>';
    formData += '<appid>' + appId + '</appid>';  // appid
    formData += '<body><![CDATA[' + '测试微信支付' + ']]></body>';
    formData += '<mch_id>' + mch_id + '</mch_id>';  // 商户号
    formData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串，不长于32位。
    formData += '<notify_url>' + notify_url + '</notify_url>';
    formData += '<openid>' + openid + '</openid>';
    formData += '<out_trade_no>' + out_trade_no + '</out_trade_no>';
    formData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>';
    formData += '<total_fee>' + total_fee + '</total_fee>';
    formData += '<trade_type>' + trade_type + '</trade_type>';
    formData += '<sign>' + sign + '</sign>';
    formData += '</xml>';

    console.log('formData===', formData);

    const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    const result = await ctx.curl(url, {
      dataType: 'text',
      timeout: 3000,
      method: 'POST',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      data: formData,
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
    });

    console.log('微信支付返回结果--', result);

    const { data } = result;

    const prepay_id = await wxpay.getXMLNodeValue(data);

    console.log('解析后的prepay_id: ', prepay_id);

    const _package = 'prepay_id=' + prepay_id;

    const signType = 'MD5';

    const minisign = wxpay.paysignjsapimini(appId, nonce_str, _package, signType, timestamp, mchkey);

    return { appId, partnerId: mchId, prepayId: prepay_id, nonceStr: nonce_str, timeStamp: timestamp, package: _package, paySign: minisign };

    // request({ url: url, method: 'POST', body: formData }, function (err, response, body) {
    //   if (!err && response.statusCode == 200) {
    //     console.log(body);

    //     xmlreader.read(body.toString('utf-8'), function (errors, response) {
    //       if (null !== errors) {
    //         console.log(errors)
    //         return;
    //       }
    //       console.log('长度===', response.xml.prepay_id.text().length);
    //       let prepay_id = response.xml.prepay_id.text();
    //       console.log('解析后的prepay_id==', prepay_id);
    //       // 将预支付订单和其他信息一起签名后返回给前端
    //       const package = 'prepay_id=' + prepay_id;
    //       const signType = 'MD5';
    //       const minisign = wxpay.paysignjsapimini(appid, nonce_str, package, signType, timestamp, mchkey);
    //       res.end(JSON.stringify({ status: '200', data: { appId: appid, partnerId: mchid, prepayId: prepay_id, nonceStr: nonce_str, timeStamp: timestamp, package: 'Sign=WXPay', paySign: minisign } }));

    //     });
    //   }
    // });
  }
}
