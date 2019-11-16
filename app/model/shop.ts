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
    priceId: { // 商品对应的价格信息
      type: mongoose.Types.ObjectId,
      required: true,
    },
    categoryId: { // 商品类目
      type: mongoose.Types.ObjectId,
      required: true,
    },
    shopNo: String, // 商品编号
    videoUrl: String,
    name: String, // 商品名称
    labels: Array, // 商品标签
    mainImage: String, // 商品的主图
    icon: String, // 商品的icon（用户列表页的展示）
    desc: String, // 商品的描述
    keywords: String, // 商品的关键字搜素
    detail: Object, // 商品的详情 富文本编辑
    type: String, // 商品的类型 1 表述虚拟产品
    extra: Object,
    remark: String, // 用户备注
    onLine: { // 是否在售 1 在售 0 下线
      type: Number,
      default: 1,
    },
    sort: { // 排序
      type: Number,
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
  ShopSchema.statics.clear = () => {
    console.log('321312312');
  };
  return mongoose.model('Shop', ShopSchema);
}
