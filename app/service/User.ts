import { Service } from 'egg';

class UserService extends Service {
  // 更新用户信息
  async add() {
    const {
      ctx,
    } = this;
    const result = await ctx.model.User.create({
      userName: 'huruqing',
    });
    return result;
  }
}
module.exports = UserService;