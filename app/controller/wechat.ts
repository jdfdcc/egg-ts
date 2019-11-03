
import { Controller } from 'egg';
import { fail, success } from '../utils/handler';

// 文档地址 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
export default class WeChatController extends Controller {

  /**
   * 微信登录接口
   */
  async wxLogin() {
    const { ctx } = this;
    const { header, service, session } = ctx;
    const { code } = header;

    if (session.code === code) {
      ctx.body = success('登录成功');
    }
    // 解析code
    const result = await service.wechat.jscode2session(code);
    const { errcode } = result.data;
    if (errcode) {
      ctx.body = fail(result.data);
    } else {
      ctx.body = success('登录成功');
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

  /**
   * 获取微信用户的基本信息
   */
  async userInfo() {
    const { ctx } = this;
    ctx.body = success(ctx.session.userInfo);
  }

  /**
   * 支付接口
   */
  async pay() {
    const { ctx } = this;
    const result = await ctx.service.wechat.pay({
      openId: ctx.session.userInfo.openId,
    });
    ctx.body = success(result);
  }
}
