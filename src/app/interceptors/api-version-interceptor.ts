import type { HttpInterceptorFn } from '@angular/common/http';

import { API_VERSION } from '../configs/app-config';

export const apiVersionInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({
    headers: req.headers.set('X-API-Version', String(API_VERSION)),
  });
  return next(clonedReq);
};
