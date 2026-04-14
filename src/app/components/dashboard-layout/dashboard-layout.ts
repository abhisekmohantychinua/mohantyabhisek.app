import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
    RouterLinkActive,
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
  readonly menuItems: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Blogs', icon: 'pi pi-book', routerLink: '/blogs' },
  ];
}
