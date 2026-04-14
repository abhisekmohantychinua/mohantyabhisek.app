import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { provideRouter, UrlTree } from '@angular/router';

import { AuthenticationStore } from '../stores/authentication-store';
import { authenticationGuard } from './authentication-guard';

describe('authenticationGuard', () => {
  let authStore: InstanceType<typeof AuthenticationStore>;
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => authenticationGuard(...params));

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    authStore = TestBed.inject(AuthenticationStore);
  });

  it('should return a UrlTree to /login when not authenticated', () => {
    const result = executeGuard(route, state);
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('should return true when authenticated', () => {
    authStore.saveAuthentication({ token: 'abc' });
    expect(executeGuard(route, state)).toBe(true);
  });
});
