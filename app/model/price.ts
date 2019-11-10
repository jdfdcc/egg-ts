import { Application } from 'egg';

/**
 * 价格
 * 时间
 * @param app
 */
export default function(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const PriceSchema = new Schema({
    uuid: { // 唯一标志 类似 _id 新建用户的时候会进行创建
      type: String,
      unique: true,
      required: true,
    },
    code: String, // 编号
    name: String, // 描述
    remark: String, // 用户备注
    items: {  // 价格表内容
      type: Array,
    },
    status: { // 商品的状态 1 正常 0 删除
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
  return mongoose.model('Price', PriceSchema);
}
