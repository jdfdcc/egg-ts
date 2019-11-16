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

/**
 * 生成订单NO
 * @param pwd
 */
export const createOrderNo = () => {
  return `O_NO_${new Date().getTime()}_${uuid(4)}`;
};

export default {
  uuid,
  pwdMd5,
  createOrderNo,
};
