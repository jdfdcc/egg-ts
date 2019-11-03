// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportClient from '../../../app/controller/client';
import ExportCommon from '../../../app/controller/common';
import ExportHome from '../../../app/controller/home';
import ExportOrder from '../../../app/controller/order';
import ExportWechat from '../../../app/controller/wechat';

declare module 'egg' {
  interface IController {
    client: ExportClient;
    common: ExportCommon;
    home: ExportHome;
    order: ExportOrder;
    wechat: ExportWechat;
  }
}
