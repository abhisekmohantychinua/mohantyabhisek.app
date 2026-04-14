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
    loadComponent: () =>
      import('./components/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
      },
      {
        path: 'blogs',
        loadChildren: () => import('./features/blogs/blogs.routes').then((m) => m.blogsRoutes),
      },
    ],
  },
];
