import { Service } from 'egg';
import { clearObj } from '../utils/tools';

export default class ShopService extends Service {

  /**
   * 查询商城列表（微信端专用）
   */
  async queryList(query: { pageSize?: 10 | undefined; current?: 1 | undefined; }) {
    const { pageSize = 10, current = 1, } = query;

    let match = {
      status: {
        $ne: 0,
      },
    };
    match = clearObj(match);
    // console.log(otherQuery);
    const totalNum = await this.ctx.model.Shop.countDocuments(match);
    // 聚合查询

    console.log('totalNum:', totalNum);
    console.log('skip:', pageSize * (current - 1));
    console.log('limit:', pageSize);
    const result = await this.ctx.model.Shop.aggregate([
      {
        $lookup: {
          from: 'prices',
          localField: 'priceId',
          foreignField: '_id',
          as: 'priceDetail',
        },
      },
      {
        $unwind: '$priceDetail',
      },
      {
        $project: {
          desc: 1,
          name: 1,
          mainImage: 1,
          labels: 1,
          priceDetail: 1,
          type: 1,
        },
      },
      {
        $match: match,
      },
      {
        $skip: pageSize * (current - 1),
      },
      {
        $limit: pageSize,
      },
    ]);

    // 查询用户是否购买科目
    // result.map(async item => {
    //   const { _id } = item;
    //   const time = await this.ctx.model.Time.findOne({
    //     shopId: _id,
    //     status: 1,
    //   });
    // });
    for (const item of result) {
      const { _id } = item;
      const time = await this.ctx.model.Time.findOne({
        shopId: _id,
        status: 1,
        userId: this.ctx.session.userInfo._id,
      });
      console.log('time', time);
      if (time) {
        item.endTime = time.endTime;
        break;
      }
    }

    // 处理数据信息
    return {
      pagination: {
        current,
        pageSize,
        total: totalNum,
      },
      list: result,
    };
  }

  /**
   * 查询某条记录
   */
  async queryDetail(id: string) {
    if (!id) {
      return false;
    }
    const shopDetail = await this.ctx.model.Shop.findOne({ _id: id, });
    if (!shopDetail) {
      return false;
    }
    const priceDetail = await this.ctx.model.Price.findOne({ _id: shopDetail.priceId, });
    console.log('priceDetail', priceDetail);
    if (priceDetail) {
      shopDetail.priceDetail = priceDetail;
    } else {
      return false;
    }
    return {
      ...shopDetail._doc,
      priceDetail,
    };
  }
}
