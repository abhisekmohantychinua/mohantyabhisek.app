import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { AuthenticationStore } from '../stores/authentication-store';

export const authenticationGuard: CanActivateFn = () => {
  const authStore = inject(AuthenticationStore);
  const router = inject(Router);
  return authStore.isAuthenticated() || router.parseUrl('/login');
};
