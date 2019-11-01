
import { Controller } from 'egg';
import { success, fail } from '../utils/handler';

export default class OrderController extends Controller {

  // const data = await ctx.service.test.sayHi('egg');
  async index() {
    const { ctx } = this;
    ctx.body = success('我是成功的返回');
  }

  async fail() {
    const { ctx } = this;
    ctx.body = fail('我是失败的返回');
  }
}
