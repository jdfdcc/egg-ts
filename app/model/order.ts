import { Application } from 'egg';

export default function(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OrderSchema = new Schema({
    uuid: { // 订单唯一标志 类似 _id 新建用户的时候会进行创建
      type: String,
      unique: true,
      required: true,
    },
    orderNo: { // 订单号码
      type: String,
      unique: true,
      required: true,
    },
    userId: { // 订单对应用户的_id
      type: String,
      required: true,
    },
    shopId: { // 商品ID
      type: String,
      required: true,
    },
    buyTime: { // 订单时间
      type: Date,
      default: new Date(),
    },
    money: Number, // 金额
    extra: Object,
    status: { // 订单状态1 表示未支付 2 表示已支付 3 表示已退款 4 表示已取消
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
  return mongoose.model('Order', OrderSchema);
}
