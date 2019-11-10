import { Application } from 'egg';

export default function(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OrderSchema = new Schema({
    uuid: {
      type: String,
      unique: true,
      required: true,
    },
    name:  { // 用户选择展示
      type: String,
      required: true,
    },
    code:  { // 用于代码使用
      type: String,
      unique: true,
      required: true,
    },
    sort: { // 排序
      type: Number,
    },
    status: { // 0删除状态 1 正常
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
  return mongoose.model('Category', OrderSchema);
}
