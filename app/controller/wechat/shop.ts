
import { Controller } from 'egg';
import { fail, success } from '../../utils/handler';

export default class ShopController extends Controller {

  /**
   * 查询商品列表
   */
  async queryList() {
    const { ctx } = this;
    const { request } = ctx;
    const result = await ctx.service.shop.queryList(request.body);
    if (result) {
      ctx.body = success(result);
    } else {
      ctx.body = fail('列表数据查询失败');
    }
  }

  /**
   * 查询商品详情
   */
  async queryDetail() {
    const { ctx } = this;
    const { request } = ctx;
    const result = await ctx.service.shop.queryDetail(request.query.id);
    if (result) {
      ctx.body = success(result);
    } else {
      ctx.body = fail('列表数据查询失败');
    }
  }
}
