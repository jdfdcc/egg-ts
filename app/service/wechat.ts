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
    // text, orderNo, orderId
    const { money, openId, orderId, body } = params;
    // 首先拿到前端传过来的参数
    const orderCode = orderId; // `SH${wxpay.createTimeStamp()}`;
    // const money = money;
    // const orderID = orderId; // `SH${wxpay.createTimeStamp()}`;
    const openid = openId;

    console.log('APP传过来的参数是', orderCode + '----' + money + '----' + appId + '-----' + appSecret + '-----' + mchId + '-----' + mchkey);

    // 首先生成签名sign
    // appid
    const mch_id = mchId;
    const nonce_str = wxpay.createNonceStr();
    const timestamp = wxpay.createTimeStamp();
    // const body = body;
    const out_trade_no = orderCode;
    const total_fee = wxpay.getmoney(money);
    const spbill_create_ip = remoteAddress; // 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
    const notify_url = wxurl;
    const trade_type = 'JSAPI';  // 'APP';公众号：'JSAPI'或'NATIVE'
    // appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type

    const sign = await wxpay.paysignjsapi(appId, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey);

    console.log('sign==', sign);

    // 组装xml数据
    let formData = '<xml>';
    formData += '<appid>' + appId + '</appid>';  // appid
    formData += '<body><![CDATA[' + body + ']]></body>';
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

    // 生成小程序支付参数
    // appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type
    const minisign = wxpay.paysignjsapimini(appId, nonce_str, _package, signType, timestamp, mchkey);

    // 返回对象
    const tempObj = {
      appId, partnerId: mchId, prepayId: prepay_id, nonceStr: nonce_str, timeStamp: timestamp, package: _package, paySign: minisign,
    };
    return tempObj;
  }

  async WxPayRefund(orderId) {
    const { ctx } = this;
    const order = await ctx.model.Order.findById(orderId);
    // const deferred = '32131'; // Q.defer();
    const { wxPayInfo } = order;
    const appid = appId;
    // const nonce_str = this.createNonceStr();
    // const timeStamp = this.createTimeStamp();
    const nonce_str = wxpay.createNonceStr();
    // const timestamp = wxpay.createTimeStamp();
    // const spbill_create_ip = remoteAddress; // 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP

    // const body = '商户退款';
    const sign = wxpay.refundsignjsapi(appId, mchId, nonce_str, wxPayInfo.out_trade_no, wxPayInfo.out_trade_no, wxPayInfo.total_fee, wxPayInfo.total_fee, mchkey);
    // wxpay.paysignjsapi({
    //   // appId, mchId, nonce_str, refund, openId: wxPayInfo.openId, out_trade_no: wxPayInfo.out_trade_no, spbill_create_ip, wxPayInfo.total_fee , 'JSAPI',
    //   appid,
    //   mch_id: mchId,
    //   nonce_str,
    //   // transaction_id: wxPayInfo.wxPayInfo,
    //   out_refund_no: wxPayInfo.out_trade_no,
    //   out_trade_no: wxPayInfo.out_trade_no,
    //   total_fee: wxPayInfo.total_fee,
    //   refund_fee: wxPayInfo.total_fee,
    //   // refund_fee_type: wxPayInfo.fee_type,
    // }, mchkey);
    const url = 'https://api.mch.weixin.qq.com/secapi/pay/refund'; //
    let formData = '<xml>';
    formData += '<appid>' + appid + '</appid>'; // 公众账号ID    appid
    // formData += '<body><![CDATA[' + body + ']]></body>';
    formData += '<mch_id>' + mchId + '</mch_id>'; // 商户号    mch_id
    formData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
    // formData += '<notify_url>' + refund + '</notify_url>'; // 退款结果通知url
    formData += '<out_refund_no>' + wxPayInfo.out_trade_no + '</out_refund_no>'; // 商户退款单号
    formData += '<out_trade_no>' + wxPayInfo.out_trade_no + '</out_trade_no>'; // 商户系统内部订单号
    formData += '<total_fee>' + wxPayInfo.total_fee + '</total_fee>'; // 订单金额
    formData += '<refund_fee>' + wxPayInfo.refund_fee + '</refund_fee>'; // 退款金额
    formData += '<sign>' + sign + '</sign>'; // 签名    sign
    formData += '</xml>';
    // const self = this;
    const result = await ctx.curl(url, {
      dataType: 'text',
      timeout: 3000,
      method: 'POST',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      data: formData,
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
    });

    const { data } = result;
    // console.log('data', data);
    const return_code = await wxpay.getXMLNodeValue(data);
    // console.log('return_code', return_code);
  }

  /**
   * 发送微信消息
   */
  async sendSubscribeMessage(params: { openId: string, template_id: string, page: string, data: any }) {
    const { openId, template_id, page, data } = params;
    // 规则校验
    const access_token = await this.getAccessToken();
    if (!access_token || !openId || !form_id || !template_id || !data) {
      return;
    }
    const req = {
      touser: openId, // 接收者（用户）的 openid
      template_id, // 模版ID
      page,
      data,
    };
    // const access_token = '27_2exs4qsEhLsNOR3vA7sQ3eIX7zufbjtOK_ui259X_KuKICdxDk1oYkiU5QZffnKCMdJgXrSdCM557Y0Q3uOgnXBD9ofDHW_1E_eeU-uXQY8Ee-LRiVttWpO7ccKP9l9DebtFdyfuQCuvTS_4COLdABAKWT';
    console.log('access_token===>', access_token);
    // console.log('req===>', req);
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`;
    const _result = await this.ctx.curl(url, {
      dataType: 'json',
      timeout: 3000,
      method: 'POST',
      data: JSON.stringify(req),
    });
    // console.log('_result===>', _result);
    // 发送成功后清除formId --- 不关心是否成功返回
    this.ctx.model.Wxform.findOneAndDelete({ formId: form_id });
    return _result;
  }

  /**
   * 获取accesstoken 缓存
   */
  async getAccessToken() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    const wxConfig = this.ctx.app.config.wechat_config.token;
    const { time, value } = wxConfig;

    // 当token未失效的时候则进行数据保存
    if (value && time && new Date().getTime() - time < 1.5 * 60 * 60 * 1000) {
      return value;
    }
    const result = await this.ctx.curl(url, {
      dataType: 'json',
      timeout: 3000,
      method: 'GET',
    });
    // console.log(result);
    if (!result.errcode) {
      // console.log(result.data.access_token);
      this.ctx.app.config.wechat_config.token.value = result.data.access_token;
      this.ctx.app.config.wechat_config.token.time = new Date().getTime();
      return result.data.access_token;
    } else {
      return;
    }
  }
}
