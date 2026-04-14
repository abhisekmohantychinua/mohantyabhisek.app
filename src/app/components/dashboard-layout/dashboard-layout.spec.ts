import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DashboardLayout } from './dashboard-layout';

describe('DashboardLayout', () => {
  let component: DashboardLayout;
  let fixture: ComponentFixture<DashboardLayout>;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DashboardLayout],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('menuItems', () => {
    it('should contain Home and Blogs entries', () => {
      expect(component.menuItems.length).toBe(2);
      expect(component.menuItems[0].label).toBe('Home');
      expect(component.menuItems[1].label).toBe('Blogs');
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
      expect(navItems.length).toBe(2);
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
