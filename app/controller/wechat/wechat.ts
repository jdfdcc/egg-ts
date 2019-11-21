
import { Controller } from 'egg';
import { fail, success } from '../../utils/handler';

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

  /**
   * 收集用户的formId
   */

  async collectFromId() {
    const { ctx } = this;
    const user = ctx.session.userInfo;
    ctx.service.common.createOrUpdate('WxForm', '', {
      openId: user.openId,
      userId: user._id,
      formId: ctx.query.formId,
    });
    ctx.body = success('接收成功');
  }

  /**
   * 发送订阅消息
   */
  async sendSubscribeMessage() {
    const { ctx } = this;
    const { model, request } = ctx;
    const { userId, openId: tempId, data, templateId, page } = request.body;
    let query: any = { _id: userId };
    if (!userId && tempId) {
      query = {
        openId: tempId,
      };
    }
    const user = await model.User.findOne(query);
    if (!user) {
      return ctx.body = fail('用户不存在');
    }
    const { openId, _id } = user;
    const wxForm = await model.WxForm.findOne({ userId: _id });
    if (!wxForm) {
      return ctx.body = fail('发送通知失败');
    }
    const { formId } = wxForm;
    const result = await ctx.service.wechat.sendSubscribeMessage(openId, formId, page, templateId, data);
    ctx.body = success(result);
  }
}
