// import crypto from 'crypto';
export const appId = 'wxcb03144d55fc82c4';
export const appSecret = 'd604093dd7c905cfe95f261e3cafbca7';

// var crypto = require('crypto')

// function WXBizDataCrypt(appId, sessionKey) {
//   this.appId = appId
//   this.sessionKey = sessionKey
// }

// WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
//   // base64 decode
//   var sessionKey = new Buffer(this.sessionKey, 'base64')
//   encryptedData = new Buffer(encryptedData, 'base64')
//   iv = new Buffer(iv, 'base64')

//   try {
//      // 解密
//     var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
//     // 设置自动 padding 为 true，删除填充补位
//     decipher.setAutoPadding(true)
//     var decoded = decipher.update(encryptedData, 'binary', 'utf8')
//     decoded += decipher.final('utf8')
//     decoded = JSON.parse(decoded)

//   } catch (err) {
//     throw new Error('Illegal Buffer')
//   }

//   if (decoded.watermark.appid !== this.appId) {
//     throw new Error('Illegal Buffer')
//   }

//   return decoded
// }

/**
 * 解析用户的基本信息
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
    throw new Error('Illegal Buffer');
  }

  if (decoded.watermark.appid !== appId) {
    throw new Error('Illegal Buffer');
  }

  return decoded;
};
