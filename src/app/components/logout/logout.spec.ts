import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthenticationStore } from '../../stores/authentication-store';
import { Logout } from './logout';

describe('Logout', () => {
  let component: Logout;
  let fixture: ComponentFixture<Logout>;
  let router: Router;
  let authStore: InstanceType<typeof AuthenticationStore>;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Logout],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Logout);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authStore = TestBed.inject(AuthenticationStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should clear authentication and navigate to /login', () => {
      authStore.saveAuthentication({ token: 'abc' });
      const navSpy = vi.spyOn(router, 'navigate');

      component.logout();

      expect(authStore.isAuthenticated()).toBe(false);
      expect(navSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('template rendering', () => {
    it('should render the logout button', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('p-button')).toBeTruthy();
    });
  });
});
