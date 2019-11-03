/**
 * 生成随机串
 */
export const uuid = (len = 32) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

/**
 * 密码加密方法
 * @param pwd
 */
export const pwdMd5 = (pwd: string) => {
  const utility = require('utility');
  return utility.md5(pwd);
};
export default {
  uuid,
  pwdMd5,
};
