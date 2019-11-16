import { Service } from 'egg';
import { createOrderNo } from '../utils/tools';

// 订单信息
export default class OrderService extends Service {
  /**
   * 创建订单
   */
  async create(params) {
    const { ctx } = this;
    const orderNo = createOrderNo();
    // 验证订单的有效性
    const { shopId, priceId } = params;
    // 获取商品详情
    const shopDetail = await ctx.service.common.queryOne('Shop', { _id: shopId });
    // 获取此时商品对应的价格详情
    const preceDetail = await ctx.service.common.queryOne('Price', { _id: shopDetail.priceId });
    if (!shopDetail || !preceDetail) {
      return false;
    }
    const items = preceDetail.items;
    let priceItem;
    // 获取客户选择的价格参数
    if (items && Array.isArray(items)) {
      items.map(item => {
        if (item.uuid === priceId) {
          priceItem = item;
        }
        return item;
      });
    }
    if (!priceItem) {
      return false;
    }

    // 生成订单
    const result = await ctx.service.common.createOrUpdate('Order', null, {
      orderNo,
      userId: ctx.session.userInfo._id,
      shopId,
      priceId: preceDetail.id,
      priceItemId: priceId,
      money: priceItem.price,
      extra: {
        shopDetail,
        preceDetail,
      },
    });
    return result;
  }

  /**
   * 删除订单
   */
  async pay(orderId) {
    const { ctx } = this;
    const orderDetail = await ctx.service.common.queryOne('Order', { _id: orderId });
    const shopDetail = await ctx.service.common.queryOne('Shop', { _id: orderDetail.shopId });
    console.log('shopDetail', shopDetail);
    console.log('orderDetail', orderDetail);
    if (!orderDetail) {
      return false;
    }

    // 生成支付信息
    const result = await ctx.service.wechat.pay({
      money: orderDetail.money,
      openId: ctx.session.userInfo.openId,
      body: `商品${shopDetail.name}`,
      orderNo: orderDetail.orderNo,
      orderId: orderDetail._id,
    });

    return result;

  }

  /**
   * 修改订单
   */
  // async update() {},

  /**
   * 查询订单
   */
  // async query() {}
}
