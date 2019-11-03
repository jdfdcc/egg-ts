
import { Controller } from 'egg';
import { success, fail } from '../utils/handler';
import { pwdMd5 } from '../utils/tools';

export default class ClientController extends Controller {
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    console.log('password:', pwdMd5(password));
    console.log('username:', username);
    const user = await ctx.service.user.findUser({
      loginName: username,
      password: pwdMd5(password),
    });

    console.log('user---', user);

    if (!user) {
      ctx.body = fail('用户名或者密码错误');
    } else {
      ctx.session.userInfo = user;
      ctx.body = success('恭喜登录成功');
    }
  }

  async userInfo() {
    const { ctx } = this;
    console.log('ctx.session', ctx.session.userInfo);
    ctx.body = success({
      roles: [ 'admin' ],
      user: ctx.session.userInfo,
    });
  }
}
