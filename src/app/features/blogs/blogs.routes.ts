import type { Routes } from '@angular/router';

export const blogsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/blogs/blogs').then((m) => m.Blogs),
  },
  {
    path: ':slug',
    loadComponent: () => import('./components/blog-detail/blog-detail').then((m) => m.BlogDetail),
  },
];
