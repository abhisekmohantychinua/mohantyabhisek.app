import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import type { Authentication } from '../../models/authentication';
import { AuthenticationStore } from '../../stores/authentication-store';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpTesting: HttpTestingController;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '', component: Login }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    messageService = fixture.debugElement.injector.get(MessageService);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should have an invalid form when empty', () => {
      expect(component.loginForm.valid).toBe(false);
    });

    it('should have a valid form when both fields are filled', () => {
      component.loginForm.setValue({ username: 'user', password: 'pass' });
      expect(component.loginForm.valid).toBe(true);
    });

    it('should require username', () => {
      component.loginForm.patchValue({ password: 'pass' });
      expect(component.loginForm.controls.username.invalid).toBe(true);
    });

    it('should require password', () => {
      component.loginForm.patchValue({ username: 'user' });
      expect(component.loginForm.controls.password.invalid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should not call the API when form is invalid', () => {
      component.onSubmit();
      httpTesting.expectNone((r) => r.url.includes('/api/auth/login'));
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.onSubmit();
      expect(component.loginForm.controls.username.touched).toBe(true);
      expect(component.loginForm.controls.password.touched).toBe(true);
    });

    it('should set loading to true on submit', () => {
      component.loginForm.setValue({ username: 'user', password: 'pass' });
      component.onSubmit();
      expect(component.loading()).toBe(true);
      httpTesting.expectOne((r) => r.url.endsWith('/api/auth/login')).flush({ token: 'abc' });
    });

    it('should show success toast and navigate on success', () => {
      const addSpy = vi.spyOn(messageService, 'add');
      const navSpy = vi.spyOn(router, 'navigate');

      component.loginForm.setValue({ username: 'user', password: 'pass' });
      component.onSubmit();

      const response: Authentication = { token: 'jwt' };
      httpTesting.expectOne((r) => r.url.endsWith('/api/auth/login')).flush(response);

      expect(addSpy).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
      expect(navSpy).toHaveBeenCalledWith(['/']);
    });

    it('should show error toast on failure', () => {
      const addSpy = vi.spyOn(messageService, 'add');

      component.loginForm.setValue({ username: 'user', password: 'pass' });
      component.onSubmit();

      httpTesting
        .expectOne((r) => r.url.endsWith('/api/auth/login'))
        .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(addSpy).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
      expect(component.loading()).toBe(false);
    });

    it('should save authentication to store on success', () => {
      const authStore = TestBed.inject(AuthenticationStore);
      component.loginForm.setValue({ username: 'user', password: 'pass' });
      component.onSubmit();

      const response: Authentication = { token: 'jwt' };
      httpTesting.expectOne((r) => r.url.endsWith('/api/auth/login')).flush(response);

      expect(authStore.getAuthentication()).toEqual(response);
    });
  });

  describe('template rendering', () => {
    it('should render username and password inputs', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('#username')).toBeTruthy();
      expect(el.querySelector('#password')).toBeTruthy();
    });

    it('should render the login button', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('p-button')).toBeTruthy();
    });

    it('should show validation errors when fields are touched and empty', async () => {
      component.loginForm.controls.username.markAsTouched();
      component.loginForm.controls.password.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      const el = fixture.nativeElement as HTMLElement;
      const errors = el.querySelectorAll('.login__error');
      expect(errors.length).toBe(2);
    });
  });
});
