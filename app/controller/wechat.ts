
import { Controller } from 'egg';
import { fail, success } from '../utils/handler';

// 文档地址 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
export default class WeChatController extends Controller {

  /**
   * 微信登录接口
   */
  async wxLogin() {
    const { ctx } = this;
    const { header, service } = ctx;
    const { code } = header;
    // 解析code
    const result = await service.wechat.jscode2session(code);
    const { errcode } = result.data;
    if (errcode) {
      ctx.body = fail(result.data);
    } else {
      ctx.body = success(result.data);
    }
  }

  /**
   * 解析并保存数据到数据库
   */
  async decryptData() {
    const { ctx } = this;
    const { service, request } = ctx;
    const { encryptedData, iv } = request.body;
    const result = await service.wechat.decryptData({
      encryptedData, iv,
    });
    if (typeof result === 'object') {
      ctx.body = success(result);
    } else {
      ctx.body = fail(result);
    }
  }
}
