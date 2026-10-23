import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { isActive, Router, RouterLink, RouterOutlet } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

import { Logout } from '../logout/logout';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    DividerModule,
    RippleModule,
    ThemeToggle,
    Logout,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout {
  private readonly router = inject(Router);
  private readonly homeUrl = this.router.createUrlTree(['/']);
  private readonly blogsUrl = this.router.createUrlTree(['/blogs']);
  private readonly categoriesUrl = this.router.createUrlTree(['/blogs/categories']);

  private readonly homeActive = isActive(this.homeUrl, this.router, {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  });
  private readonly blogsActive = isActive(this.blogsUrl, this.router, {
    paths: 'subset',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  });
  private readonly categoriesActive = isActive(this.categoriesUrl, this.router, {
    paths: 'subset',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  });

  readonly menuItems: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Blogs', icon: 'pi pi-book', routerLink: '/blogs' },
    { label: 'Categories', icon: 'pi pi-tags', routerLink: '/blogs/categories' },
  ];

  protected isMenuItemActive(item: MenuItem): boolean {
    switch (item.label) {
      case 'Home':
        return this.homeActive();
      case 'Blogs':
        return this.blogsActive() && !this.categoriesActive();
      case 'Categories':
        return this.categoriesActive();
      default:
        return false;
    }
  }
}
