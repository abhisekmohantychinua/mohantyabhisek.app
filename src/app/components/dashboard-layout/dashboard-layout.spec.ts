import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { DashboardLayout } from './dashboard-layout';

@Component({
  template: '',
})
class EmptyRoute {}

describe('DashboardLayout', () => {
  let component: DashboardLayout;
  let fixture: ComponentFixture<DashboardLayout>;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DashboardLayout],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: EmptyRoute }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayout);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('menuItems', () => {
    it('should contain Home, Blogs, and Categories entries', () => {
      expect(component.menuItems.length).toBe(3);
      expect(component.menuItems[0].label).toBe('Home');
      expect(component.menuItems[1].label).toBe('Blogs');
      expect(component.menuItems[2].label).toBe('Categories');
    });
  });

  describe('template rendering', () => {
    it('should render the sidebar', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.dashboard-layout__sidebar')).toBeTruthy();
    });

    it('should render the content area with router-outlet', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.dashboard-layout__content')).toBeTruthy();
      expect(el.querySelector('router-outlet')).toBeTruthy();
    });

    it('should render nav items for each menu entry', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const navItems = el.querySelectorAll('.dashboard-layout__nav-item');
      expect(navItems.length).toBe(3);
    });

    it('should only highlight Categories on category routes', async () => {
      await router.navigateByUrl('/blogs/categories/example');
      fixture.detectChanges();

      const navItems = fixture.nativeElement.querySelectorAll(
        '.dashboard-layout__nav-item',
      ) as NodeListOf<HTMLElement>;
      expect(navItems[1].classList.contains('dashboard-layout__nav-item--active')).toBe(false);
      expect(navItems[2].classList.contains('dashboard-layout__nav-item--active')).toBe(true);
    });

    it('should keep Blogs highlighted on blog detail routes', async () => {
      await router.navigateByUrl('/blogs/example');
      fixture.detectChanges();

      const navItems = fixture.nativeElement.querySelectorAll(
        '.dashboard-layout__nav-item',
      ) as NodeListOf<HTMLElement>;
      expect(navItems[1].classList.contains('dashboard-layout__nav-item--active')).toBe(true);
      expect(navItems[2].classList.contains('dashboard-layout__nav-item--active')).toBe(false);
    });

    it('should render dividers', () => {
      const el = fixture.nativeElement as HTMLElement;
      const dividers = el.querySelectorAll('p-divider');
      expect(dividers.length).toBeGreaterThanOrEqual(3);
    });

    it('should render the theme toggle', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('app-theme-toggle')).toBeTruthy();
    });

    it('should render the logout component', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('app-logout')).toBeTruthy();
    });
  });
});
