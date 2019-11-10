// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOrder from '../../../app/model/order';
import ExportPrice from '../../../app/model/price';
import ExportShop from '../../../app/model/shop';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Order: ReturnType<typeof ExportOrder>;
    Price: ReturnType<typeof ExportPrice>;
    Shop: ReturnType<typeof ExportShop>;
    User: ReturnType<typeof ExportUser>;
  }
}
