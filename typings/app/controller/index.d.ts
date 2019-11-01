// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCommon from '../../../app/controller/common';
import ExportHome from '../../../app/controller/home';
import ExportOrder from '../../../app/controller/order';

declare module 'egg' {
  interface IController {
    common: ExportCommon;
    home: ExportHome;
    order: ExportOrder;
  }
}
