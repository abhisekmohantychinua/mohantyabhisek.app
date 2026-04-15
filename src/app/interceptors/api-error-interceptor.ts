import type { HttpErrorResponse} from '@angular/common/http';
import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

import type { ApiError } from '../models/api-error';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as ApiError | null;
      const detail = apiError?.message ?? 'An unexpected error occurred.';

      messageService.add({
        severity: 'error',
        summary: `Error ${error.status}`,
        detail,
      });

      return throwError(() => error);
    }),
  );
};
