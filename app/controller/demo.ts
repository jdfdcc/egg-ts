
import { Controller } from 'egg';
import { success, fail } from '../utils/handler';

export default class DemoController extends Controller {
  async testAsync() {
    const { ctx } = this;
    ctx.body = success('我是成功的返回');
  }

  async fail() {
    const { ctx } = this;
    ctx.body = fail('我是失败的返回');
  }
}
