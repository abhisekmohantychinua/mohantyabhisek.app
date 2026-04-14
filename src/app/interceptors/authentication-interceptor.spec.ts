import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthenticationStore } from '../stores/authentication-store';
import { authenticationInterceptor } from './authentication-interceptor';

describe('authenticationInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;
  let authStore: InstanceType<typeof AuthenticationStore>;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authenticationInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authStore = TestBed.inject(AuthenticationStore);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should not add Authorization header when not authenticated', () => {
    httpClient.get('/test').subscribe();

    const req = httpTesting.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add Authorization header with Bearer token when authenticated', () => {
    authStore.saveAuthentication({ token: 'my-jwt' });

    httpClient.get('/test').subscribe();

    const req = httpTesting.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt');
    req.flush({});
  });

  it('should pass through the original request when not authenticated', () => {
    httpClient.get('/api/data', { headers: { 'X-Custom': 'value' } }).subscribe();

    const req = httpTesting.expectOne('/api/data');
    expect(req.request.headers.get('X-Custom')).toBe('value');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
