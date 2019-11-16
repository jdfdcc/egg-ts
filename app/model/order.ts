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
      type: mongoose.Types.ObjectId,
      required: true,
    },
    shopId: { // 商品ID
      type: mongoose.Types.ObjectId,
      required: true,
    },
    priceId: { // 商品所选择的价格ID
      type: mongoose.Types.ObjectId,
      required: true,
    },
    priceItemId: { // 商品所选择的价格对应的梯度ID
      type: String,
      required: true,
    },
    buyTime: { // 订单时间
      type: Date,
      default: new Date(),
    },
    money: {
      type: Number,
      default: 0,
    }, // 金额
    status: { // 订单状态 1 表示创建了订单未支付 2、表示已支付 3、表示已退款 4、表示已取消
      type: Number,
      default: 1,
    },
    wxPayInfo: Object, // 微信支付返回信息
    extra: Object,
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
