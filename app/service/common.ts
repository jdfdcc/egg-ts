import { Service } from 'egg';

/**
 * 公共服务
 * 对某个表进行公共的操作
 */
export default class CommonService extends Service {
  /**
   * 创建记录
   */
  async create(params) {},

  /**
   * 修改记录
   */
  async update(params) {},

  /**
   * 创建或者修改记录
   */
  async createOrUpdate(params) {},

  /**
   * 查询某条记录
   */
  async queryOne(params) {},

  /**
   * 分页查询
   */
  async queryList(params) {},

  /**
   * 删除记录 逻辑删除
   * 修改status 为 0
   */
  async delete(params) {},
}
