import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_VERSION } from '../configs/app-config';
import { apiVersionInterceptor } from './api-version-interceptor';

describe('apiVersionInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiVersionInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add X-API-Version header to every request', () => {
    httpClient.get('/test').subscribe();

    const req = httpTesting.expectOne('/test');
    expect(req.request.headers.get('X-API-Version')).toBe(String(API_VERSION));
    req.flush({});
  });

  it('should preserve existing headers', () => {
    httpClient.get('/test', { headers: { 'X-Custom': 'value' } }).subscribe();

    const req = httpTesting.expectOne('/test');
    expect(req.request.headers.get('X-Custom')).toBe('value');
    expect(req.request.headers.get('X-API-Version')).toBe(String(API_VERSION));
    req.flush({});
  });
});
