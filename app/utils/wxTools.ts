// import xmlreader from 'xmlreader';

function raw(args) {
  let keys = Object.keys(args);
  keys = keys.sort();
  const newArgs = {};
  keys.forEach(key => {
    newArgs[key] = args[key];
  });
  let string = '';
  for (const k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}

export default {
  // 把金额转为分
  getmoney: money => {
    return Math.round(parseFloat(money) * 100);
  },

  // 随机字符串产生函数
  createNonceStr: () => {
    return Math.random().toString(36).substr(2, 15);
  },

  // 时间戳产生函数
  createTimeStamp: () => {
    return parseInt(new Date().getTime() / 1000 + '') + '';
  },

  // 签名加密算法
  paysignjsapi: async (appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey) => {
    const ret = {
      appid,
      mch_id,
      nonce_str,
      body,
      notify_url,
      openid,
      out_trade_no,
      spbill_create_ip,
      total_fee,
      trade_type,
    };
    console.log('ret==', ret);
    let string = raw(ret);
    // let string = `appid=${appid}&body=${body}&device_info=1000&mch_id=${mch_id}&nonce_str=${nonce_str}`;
    const key = mchkey;
    string = string + '&key=' + key;
    console.log('string=', string);
    const crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
  },

  // 小程序签名
  paysignjsapimini: (appId, nonceStr, _package, signType, timestamp, mchkey) => {
    const ret = {
      appId,
      nonceStr,
      package: _package,
      signType,
      timeStamp: timestamp,
    };
    console.log('Miniret==', ret);
    let string = raw(ret);
    const key = mchkey;
    string = string + '&key=' + key;
    console.log('Ministring>>>>>>', string);
    const crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
  },

  // 退款的签名生成
  refundsignjsapi(appid, mch_id, nonce_str, out_refund_no, out_trade_no, refund_fee, total_fee, mchkey) {
    const ret = {
        appid,
        mch_id,
        nonce_str,
        // notify_url: notify_url,
        out_refund_no,
        out_trade_no,
        refund_fee,
        total_fee,
    };
    let string = raw(ret);
    string = string + '&key=' + mchkey; // key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
    const crypto = require('crypto');
    const sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
    return sign.toUpperCase();
  },

  getXMLNodeValue: async xml => {
    const xmlreader = require('xmlreader');
    return new Promise((resolve, reject) => {
      xmlreader.read(xml, (errors, response) => {
        // tslint:disable-next-line:binary-expression-operand-order
        if (null !== errors) {
          console.log(errors);
          reject(errors);
          return;
        }
        console.log('长度===', response.xml.prepay_id.text().length);
        const prepay_id = response.xml.prepay_id.text();
        console.log('解析后的prepay_id==', prepay_id);
        resolve(prepay_id);
      });
    });
  },
};
