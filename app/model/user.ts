import { Application } from 'egg';

export default function(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    uuid: { // 用户唯一标志 类似 _id 新建用户的时候会进行创建
      type: String,
      unique: true,
      required: true,
    },
    userName: String,
    sex: String, // F 女 M 男
    loginName: String, // 登录用户名
    password: String, // 登录密码
    idNo: String, // 用户身份证号码
    type: String, // 用户类型 1 微信用户 2 pc用户 0 未设置
    avatar: String, // 用户头像
    openId: String, // 微信openId
    phone: String,
    extra: Object,
    status: { // 0表示删除 1表示正常 2 表示冻结
      type: Number,
      default: 1,
    },
    remark: String, // 用户备注
    createTime: {
      type: Date,
      default: new Date(),
    },
    updateTime: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model('User', UserSchema);
}
