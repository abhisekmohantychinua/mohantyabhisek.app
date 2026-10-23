import type { Routes } from '@angular/router';

export const blogsRoutes: Routes = [
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/blog-categories/blog-categories').then((m) => m.BlogCategories),
  },
  {
    path: '',
    loadComponent: () => import('./components/blogs/blogs').then((m) => m.Blogs),
  },
  {
    path: ':slug',
    loadComponent: () => import('./components/blog-detail/blog-detail').then((m) => m.BlogDetail),
  },
];
