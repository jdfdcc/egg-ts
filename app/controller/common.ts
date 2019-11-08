
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
    const { pageSize = 10, pageNum = 1, ...otherQuery } = query;
    console.log('model', ctx.model);
    const tempQuery = {};
    for (const key in otherQuery) {
      if (/^\/.*\/$/.test(otherQuery[key])) {
        tempQuery[key] = new RegExp(otherQuery[key]);
      }
    }
    const result = await ctx.model[_model].find(tempQuery, tempFilter).skip(pageSize * (pageNum - 1)).limit(pageSize);
    ctx.body = success(result);
  }

  /**
   * 公共保存或者修改的接口
   */
  async save() {
    const { ctx } = this;
    ctx.body = fail('我是失败的返回');
  }

  /**
   * 公共删除的接口
   */
  async delete() {
    const { ctx } = this;
    ctx.body = fail('我是失败的返回');
  }
}
