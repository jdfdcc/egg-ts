// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuth from '../../../app/middleware/auth';
import ExportGzip from '../../../app/middleware/gzip';

declare module 'egg' {
  interface IMiddleware {
    auth: typeof ExportAuth;
    gzip: typeof ExportGzip;
  }
}
