
import { Controller } from 'egg';
import { fail } from '../utils/handler';
import { appId, appSecret } from '../utils/wechat';

// 文档地址 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
export default class WeChatController extends Controller {

  /**
   * 公共删除的接口
   */
  async login() {
    // GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    const { ctx } = this;
    const { code } = ctx.query;
    const result = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, {
      dataType: 'json',
      timeout: 3000,
    });
    console.log(result);
    ctx.body = fail(result.data);
  }
}
