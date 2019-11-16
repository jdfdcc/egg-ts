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

export const numid = (len = 32) => {
  const $chars = '1234567890';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

/**
 * 生成订单NO
 * @param pwd
 */
export const createOrderNo = () => {
  return `C${numid(10)}`;
};

// 去除为null和undefind的对象
export const clearObj = (obj: any) => {
  for(const key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  }
  return obj;
};

export default {
  uuid,
  pwdMd5,
  createOrderNo,
  clearObj,
};
