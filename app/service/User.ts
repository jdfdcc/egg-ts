import { Service } from 'egg';

export default class UserService extends Service {
  // 保存或者更新用户信息
  async update(params) {
    const { ctx } = this;
    const { openId, type } = params;
    // 微信用户校验
    if (+type === 1 && !openId) {
      return '保存微信用户的时候 openId不能为空';
    }
    const User = new ctx.model.User(params);
    let tempUser = await ctx.model.User.findOne({ openId });
    if (!tempUser) {
      tempUser = await User.save(params);
    } else {
      await ctx.model.User.updateOne({ openId }, params);
    }
    return await ctx.model.User.findOne({ openId });
  }

  /**
   * 查询用户信息
   */
  async findUser(params) {
    const { ctx } = this;
    console.log('查询条件', params);
    params.status = {
      $ne: 0,
    };
    // 不能暴露密码
    const tempUser = await ctx.model.User.findOne(params, {
      password: 0,
    });
    return {
      avatar: tempUser.avatar,
      userName: tempUser.userName,
    };
  }
}
