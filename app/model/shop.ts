import { Application } from 'egg';

export default function(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ShopSchema = new Schema({
    uuid: { // 商品唯一标志 类似 _id 新建用户的时候会进行创建
      type: String,
      unique: true,
      required: true,
    },
    images: { // 商品的详情 图片的形式
      type: Array,
    },
    detail: Object, // 商品的详情
    price: Number, // 商品的价格
    type: Number, // 商品的类型
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
  return mongoose.model('Shop', ShopSchema);
}
