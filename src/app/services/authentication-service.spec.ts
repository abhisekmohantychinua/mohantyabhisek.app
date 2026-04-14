import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { Authentication } from '../models/authentication';
import type { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationStore } from '../stores/authentication-store';
import { AuthenticationService } from './authentication-service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTesting: HttpTestingController;
  let authStore: InstanceType<typeof AuthenticationStore>;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthenticationService);
    httpTesting = TestBed.inject(HttpTestingController);
    authStore = TestBed.inject(AuthenticationStore);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('login', () => {
    it('should POST to the login endpoint', () => {
      const request: AuthenticationRequest = { username: 'user', password: 'pass' };
      const response: Authentication = { token: 'jwt-token' };

      service.login(request).subscribe();

      const req = httpTesting.expectOne((r) => r.url.endsWith('/api/auth/login'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(response);
    });

    it('should save authentication to the store on success', () => {
      const request: AuthenticationRequest = { username: 'user', password: 'pass' };
      const response: Authentication = { token: 'jwt-token' };

      service.login(request).subscribe();

      httpTesting.expectOne((r) => r.url.endsWith('/api/auth/login')).flush(response);
      expect(authStore.getAuthentication()).toEqual(response);
      expect(authStore.isAuthenticated()).toBe(true);
    });

    it('should return the authentication response', () => {
      const request: AuthenticationRequest = { username: 'user', password: 'pass' };
      const response: Authentication = { token: 'jwt-token' };
      let result: Authentication | undefined;

      service.login(request).subscribe((auth) => (result = auth));

      httpTesting.expectOne((r) => r.url.endsWith('/api/auth/login')).flush(response);
      expect(result).toEqual(response);
    });
  });

  describe('logout', () => {
    it('should clear authentication from the store', () => {
      authStore.saveAuthentication({ token: 'abc' });
      service.logout();
      expect(authStore.isAuthenticated()).toBe(false);
      expect(authStore.getAuthentication()).toBeNull();
    });
  });
});
