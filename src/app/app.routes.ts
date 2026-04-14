import type { Routes } from '@angular/router';

import { authenticationGuard } from './guards/authentication-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authenticationGuard],
    children: [],
  },
];
