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
    priceDetail: { // 当时购买的价格详情
      type: Object,
      required: true,
    },
    levelId: { // 购买的档次
      type: String,
      required: true,
    },
    startTime: { // 购买课程开始时间
      type: Date,
      default: new Date(),
    },
    endTime: {// 购买课程结束时间
      type: Date,
      default: new Date(),
    },
    shopId: { // 商品类目
      type: mongoose.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      default: 1,
    }, // 时长购买
    status: { // 0 删除 1 正常 2 失效
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
  return mongoose.model('time', ShopSchema);
}
