import { Service } from 'egg';
import { appId, appSecret, decryptData } from '../utils/wechat';
import { uuid } from '../utils/tools';

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
}
