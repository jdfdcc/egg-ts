import { Service } from 'egg';
import { appId, appSecret, decryptData } from '../utils/wechat';

export default class WeChatService extends Service {
  /**
   * @param code 获取code
   */
  async jscode2session(code) {
    const { ctx } = this;
    // const user = await this.ctx.db.query('select * from user where uid = ?', uid);
    const result = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, {
      dataType: 'json',
      timeout: 3000,
    });

    ctx.session.sessionKey = result.data.session_key;
    return result;
  }

  /**
   * 解析接口
   */
  async decryptData(params) {
    const { encryptedData, iv, sessionKey } = params;
    const result = await decryptData(encryptedData, iv, sessionKey);
    return result;
  }
}
