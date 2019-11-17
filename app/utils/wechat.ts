// 小程序appid
export const appId = 'wxcb03144d55fc82c4';
// 小程序secerct
export const appSecret = 'd604093dd7c905cfe95f261e3cafbca7';
// 商户号
export const mchId = '1515299391';

// zqAmlwL6OXfdlfKBDnBOe807AaaSe7Uq
// 7c88a050fc54784c28c1b7b0231096ad
export const mchkey = 'zqAmlwL6OXfdlfKBDnBOe807AaaSe7Uq';

export const remoteAddress = '119.23.255.136';

export const wxurl = 'https://jerome.chaobenxueyuan.com/api/order/payresult';

export const refund = 'https://jerome.chaobenxueyuan.com/api/order/refund';

/**
 * 解析小程序的加密信息
 * @param encryptedData
 * @param iv
 * @param sessionKey
 */
export const decryptData = async (encryptedData: string, iv: string, sessionKey: string) => {
  const crypto = require('crypto');
  //   // base64 decode
  const tsessionKey = new Buffer(sessionKey, 'base64');
  const tencryptedData = new Buffer(encryptedData, 'base64');
  const tiv = new Buffer(iv, 'base64');
  let decoded;
  try {
     // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', tsessionKey, tiv);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(tencryptedData, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);
  } catch (err) {
    return false;
  }

  if (decoded.watermark.appid !== appId) {
    return false;
  }

  return decoded;
};
