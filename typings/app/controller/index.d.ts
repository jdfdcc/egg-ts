// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCommon from '../../../app/controller/common';
import ExportOrder from '../../../app/controller/order';
import ExportClientClient from '../../../app/controller/client/client';
import ExportWechatShop from '../../../app/controller/wechat/shop';
import ExportWechatWechat from '../../../app/controller/wechat/wechat';

declare module 'egg' {
  interface IController {
    common: ExportCommon;
    order: ExportOrder;
    client: {
      client: ExportClientClient;
    }
    wechat: {
      shop: ExportWechatShop;
      wechat: ExportWechatWechat;
    }
  }
}
