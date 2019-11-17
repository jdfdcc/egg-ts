import { Service } from 'egg';
import { createOrderNo, clearObj } from '../utils/tools';

// 订单信息
export default class OrderService extends Service {

  /**
   * 创建记录
   */
  async queryList(query) {
    const { ctx } = this;
    const { pageSize = 10, current = 1, shopName = '', userName = '', orderNo = '', status, } = query;
    let match = {
      'shopDetail.name': new RegExp(`.*${shopName}.*`, 'i'),
      'userDetail.userName': new RegExp(`.*${userName}.*`, 'i'),
      orderNo: new RegExp(`.*${orderNo}.*`),
      status: status ? +status : undefined,
    };
    match = clearObj(match);
    const totals = await ctx.model.Order.aggregate([
      {
        $lookup: {
          from: 'shops',
          localField: 'shopId',
          foreignField: '_id',
          as: 'shopDetail',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetail',
        },
      },
      {
        $unwind: '$userDetail',
      },
      {
        $unwind: '$shopDetail',
      },
      {
        $match: match,
      },
      {
        $project: {
          orderNo: 1,
        },
      },
    ]);
    // 聚合查询
    const result = await ctx.model.Order.aggregate([
      {
        $lookup: {
          from: 'shops',
          localField: 'shopId',
          foreignField: '_id',
          as: 'shopDetail',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetail',
        },
      },
      {
        $unwind: '$userDetail',
      },
      {
        $unwind: '$shopDetail',
      },
      {
        $match: match,
      },
      {
        $project: {
          orderNo: 1,
          userId: 1,
          shopId: 1,
          money: 1,
          status: 1,
          priceDetail: 1,
          levelId: 1,
          createTime: 1,
          remark: 1,
          shopDetail: {
            _id: 1,
            name: 1,
          },
          userDetail: {
            userName: 1,
            _id: 1,
          },
        },
      },
      {
        $skip: pageSize * (current - 1),
      },
      {
        $limit: pageSize,
      },
    ]);

    console.log('result:', result);

    // 处理数据信息
    return {
      pagination: {
        current,
        pageSize,
        total: totals.length,
      },
      list: result,
    };
  }

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
      priceDetail: preceDetail,
      levelId: priceId,
      money: priceItem.price,
      extra: {
        shopDetail,
        preceDetail,
      },
    });
    return result;
  }

  /**
   * 支付订单
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
   * 修改订单的状态, 支付成功
   * _extra 存在于支付中间表
   */
  async paySuccess(_id, _extra) {
    const { ctx } = this;
    // 订单只能从未支付到已支付的状态
    const result = await ctx.model.Order.updateOne({
      _id,
      status: 1,
    }, {
      status: 2,
      wxPayInfo: _extra,
    });
    // { ok: 1, nModified: 0, n: 0 }
    console.log('order-----:', result);
    if (+result.ok === 1) {
      await this.createUserTime(_id);
    }
    return result;
  }

  /**
   *  兑换时长
   *  增加小伙的购买时长表
   */
  async createUserTime(orderId: string) {
    const { ctx } = this;
    const orderDetail = await ctx.model.Order.findById(orderId);
    let time = false;
    try {
      time = await ctx.model.Time.findOne({ orderId, status: 1 });
    } catch (error) {
      // 捕捉报错信息
      time = true;
    }
    if (orderDetail && !time) {
      const { priceDetail, levelId, shopId, userId } = orderDetail;
      const { items } = priceDetail;
      let timeObj;
      items.map(item => {
        if (item.uuid === levelId) {
          timeObj = item;
        }
        return item;
      });
      const { time, unit } = timeObj;
      // d 天 w 星期 m 月 y 年 unit
      const endTime = new Date();
      switch (unit) {
        case 'd': // 天
          endTime.setDate(endTime.getDate() + time);
          break;
        case 'w': // 周
          endTime.setDate(endTime.getDate() + time * 7);
          break;
        case 'm': // 月
          endTime.setMonth(endTime.getMonth() + time);
          break;
        case 'y': // 年
          endTime.setFullYear(endTime.getFullYear() + time);
          break;
        default:
          break;
      }

      // ctx.model.Time.
      const result = await ctx.service.common.createOrUpdate('Time', null, {
        userId,
        priceDetail,
        startTime: new Date(),
        endTime,
        levelId,
        orderId,
        shopId,
      });
      return result;
    } else {
      return false;
    }
  }
}
