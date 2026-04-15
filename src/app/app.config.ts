import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { appPreset } from './configs/app-preset';
import { apiErrorInterceptor } from './interceptors/api-error-interceptor';
import { apiVersionInterceptor } from './interceptors/api-version-interceptor';
import { authenticationInterceptor } from './interceptors/authentication-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authenticationInterceptor, apiVersionInterceptor, apiErrorInterceptor]),
    ),
    MessageService,
    providePrimeNG({
      theme: {
        preset: appPreset,
        options: {
          darkModeSelector: '.app-dark',
          ripple: true,
        },
      },
    }),
  ],
};
