import { Application } from 'egg';

/**
 * 收集微信端formId
 * @param app
 */
export default function(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WxFormSchema = new Schema({
    uuid: { // 用户唯一标志 类似 _id 新建用户的时候会进行创建
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    openId: {
      type: String,
      required: true,
    },
    formId: { // 手机的formId
      type: String,
      unique: true,
      required: true,
    },
    status: { // 0 表示删除 1表示正常
      type: Number,
      default: 1,
    },
    createTime: {
      type: Date,
      default: new Date(),
    },
    updateTime: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model('WxForm', WxFormSchema);
}
