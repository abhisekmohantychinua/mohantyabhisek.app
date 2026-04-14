import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { appPreset } from './configs/app-preset';
import { apiVersionInterceptor } from './interceptors/api-version-interceptor';
import { authenticationInterceptor } from './interceptors/authentication-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authenticationInterceptor, apiVersionInterceptor])),
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
