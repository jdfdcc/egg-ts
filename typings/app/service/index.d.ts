// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUser from '../../../app/service/user';
import ExportWechat from '../../../app/service/wechat';

declare module 'egg' {
  interface IService {
    user: ExportUser;
    wechat: ExportWechat;
  }
}
