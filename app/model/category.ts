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
    code:  { // 编号
      type: String,
      required: true,
    },
    name:  { // 类型
      type: String,
      required: true,
    },
    sort: { // 排序
      type: Number,
    },
    status: { // 0删除状态 1 正常
      type: Number,
      default: 1,
    },
    remark: String, // 备注
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
