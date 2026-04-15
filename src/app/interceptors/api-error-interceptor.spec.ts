import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { apiErrorInterceptor } from './api-error-interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should show an error toast with the API error message', () => {
    const addSpy = vi.spyOn(messageService, 'add');

    http.get('/api/test').subscribe({
      error: () => {
        /* expected */
      },
    });

    httpTesting
      .expectOne('/api/test')
      .flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });

    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error 404',
      detail: 'Not found',
    });
  });

  it('should show a fallback message when response has no message', () => {
    const addSpy = vi.spyOn(messageService, 'add');

    http.get('/api/test').subscribe({
      error: () => {
        /* expected */
      },
    });

    httpTesting
      .expectOne('/api/test')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });

    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error 500',
      detail: 'An unexpected error occurred.',
    });
  });

  it('should re-throw the error', () => {
    const errorSpy = vi.fn();

    http.get('/api/test').subscribe({ error: errorSpy });

    httpTesting
      .expectOne('/api/test')
      .flush({ message: 'Conflict' }, { status: 409, statusText: 'Conflict' });

    expect(errorSpy).toHaveBeenCalled();
  });

  it('should not interfere with successful responses', () => {
    const addSpy = vi.spyOn(messageService, 'add');
    const nextSpy = vi.fn();

    http.get('/api/test').subscribe({ next: nextSpy });

    httpTesting.expectOne('/api/test').flush({ data: 'ok' });

    expect(nextSpy).toHaveBeenCalledWith({ data: 'ok' });
    expect(addSpy).not.toHaveBeenCalled();
  });
});
