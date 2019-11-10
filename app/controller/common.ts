
import { Controller } from 'egg';
import { success, fail } from '../utils/handler';

export default class CommonController extends Controller {

  /**
   * 公共获取列表数据的接口
   */
  async getList() {
    const { ctx } = this;
    const { request } = ctx;
    const { _model, query = {}, filters = [] } = request.body;
    if (!_model) {
      ctx.body = fail('请设置_model参数');
      return;
    }
    const tempFilter = {};
    if (Array.isArray(filters)) {
      filters.map((key: string) => {
        tempFilter[key] = 1;
        return key;
      });
    } else {
      ctx.body = fail('请选择你要查询的字段');
      return;
    }
    const result = await ctx.service.common.queryList(_model, query, tempFilter);
    ctx.body = success(result);
  }

  /**
   * 公共保存或者修改的接口
   */
  async save() {
    const { ctx } = this;
    const { request } = ctx;
    const { _id, _model, ...other } = request.body;
    const result = await ctx.service.common.createOrUpdate(_model, _id, other);
    if (result) {
      ctx.body = success(result);
    } else {
      ctx.body = fail('失败了');
    }
  }

  /**
   * 公共删除的接口
   */
  async queryOne() {
    const { ctx } = this;
    const { request } = ctx;
    const { params, _model } = request.body;
    console.log(params, _model);
    const result = await ctx.service.common.queryOne(_model, params);
    if (result) {
      ctx.body = success(result);
    } else {
      ctx.body = fail('失败了');
    }
  }
}
