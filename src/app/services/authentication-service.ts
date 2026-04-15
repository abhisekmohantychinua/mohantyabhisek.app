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
   * Authenticates a user with the provided credentials and persists the
   * returned token in the authentication store.
   *
   * @param request - The login credentials containing username and password.
   * @returns An observable emitting the authentication response with a bearer
   *   token.
   *
   * @remarks
   * **API behavior** (`POST /api/auth/login`): Authenticates credentials by
   * loading the user by username and verifying the submitted password against
   * the stored encoded password. If the username is unknown or the password
   * does not match → 401 Unauthorized. On success, a new token is issued for
   * the username and returned to the client.
   *
   * After the HTTP response, the token is stored client-side via the
   * {@link AuthenticationStore}.
   */
  login(request: AuthenticationRequest): Observable<Authentication> {
    return this.http.post<Authentication>(`${BASE_URL}/api/auth/login`, request).pipe(
      tap((authentication) => {
        this.authStore.saveAuthentication(authentication);
      }),
    );
  }

  /**
   * Logs the user out by clearing the persisted authentication from the store.
   *
   * @remarks
   * This is a client-side-only operation — no server request is made. The
   * stored token is removed from the {@link AuthenticationStore}, effectively
   * ending the user session.
   */
  logout(): void {
    this.authStore.clearAuthentication();
  }
}
