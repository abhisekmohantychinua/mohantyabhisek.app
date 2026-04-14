import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthenticationStore } from '../stores/authentication-store';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthenticationStore);
  const authentication = authStore.getAuthentication();

  if (authentication) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authentication.token}`),
    });
    return next(clonedReq);
  }

  return next(req);
};
