import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';

import { BASE_URL } from '../configs/app-config';
import type { Authentication } from '../models/authentication';
import type { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationStore } from '../stores/authentication-store';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthenticationStore);

  /**
   * Authenticates a user and stores the returned token.
   *
   * @param request - The login credentials.
   * @returns An observable emitting the authentication response.
   */
  login(request: AuthenticationRequest): Observable<Authentication> {
    return this.http.post<Authentication>(`${BASE_URL}/api/auth/login`, request).pipe(
      tap((authentication) => {
        this.authStore.saveAuthentication(authentication);
      }),
    );
  }

  /** Clears the stored authentication and logs the user out. */
  logout(): void {
    this.authStore.clearAuthentication();
  }
}
