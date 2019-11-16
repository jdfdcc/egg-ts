import { Service } from 'egg';
import { uuid } from '../utils/tools';
/**
 * 公共服务
 * 对某个表进行公共的操作
 */
export default class CommonService extends Service {
  /**
   * 创建记录
   */
  async queryList(_model, query, filters) {
    if (!_model) {
      return false;
    }

    const { pageSize = 10, current = 1, pageNum = 1, total, ...otherQuery } = query;
    const tempQuery = {
      status: {
        $ne: 0,
      },
    };
    for (const key in otherQuery) {
      if (/^\/.*\/$/.test(otherQuery[key])) {
        console.log(otherQuery[key].replace('/', ''));
        tempQuery[key] = new RegExp(otherQuery[key].replace(/\//g, ''));
      } else {
        tempQuery[key] = otherQuery[key];
      }
    }
    console.log('tempQuery:', tempQuery);
    console.log('filters:', filters);
    const totalNum = await this.ctx.model[_model].count(tempQuery);
    const result = await this.ctx.model[_model].find(tempQuery, filters, {
      skip: pageSize * (current - 1),
      limit: pageSize,
    }).sort({ updateTime: -1 });
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
   * 创建或者修改记录
   * _id 需要更新的记录id 如果不存在 则视为新增
   * params 更新的数据
   */
  async createOrUpdate(_model, _id, params) {
    let result;
    if (!_model) {
      return false;
    }
    const ModelClass = this.ctx.model[_model];
    if (_id) {
      params.updateTime = new Date();
      result = await ModelClass.updateOne({ _id, }, params);
    } else {
      params.uuid = uuid();
      params.updateTime = new Date();
      const Model = new ModelClass(params);
      console.log('params', params);
      result = await Model.save();
    }
    return result;
  }

  /**
   * 查询某条记录
   */
  async queryOne(_model, params) {
    if (!_model) {
      return false;
    }
    return await this.ctx.model[_model].findOne(params);
  }

  /**
   * 分页查询
   */
  // async queryList() {},

  /**
   * 删除记录 逻辑删除
   * 修改status 为 0
   */
  // async delete() {},
}
