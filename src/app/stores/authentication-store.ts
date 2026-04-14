import {
  patchState,
  signalStore,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import type { Authentication } from '../models/authentication';

interface AuthenticationState {
  authentication: Authentication | null;
}

const INITIAL_STATE: AuthenticationState = {
  authentication: null,
};

export const AuthenticationStore = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_STATE),
  withHooks((store) => {
    let watcher: { destroy: () => void } | undefined;

    return {
      onInit(): void {
        try {
          const raw = sessionStorage.getItem('AuthenticationStore');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              patchState(store, { authentication: parsed.authentication ?? null });
            }
          }
        } catch {
          // ignore malformed session data
        }

        watcher = watchState(store, (state) => {
          try {
            sessionStorage.setItem(
              'AuthenticationStore',
              JSON.stringify({ authentication: state.authentication }),
            );
          } catch {
            // ignore storage errors
          }
        });
      },
      onDestroy(): void {
        watcher?.destroy();
      },
    };
  }),
  withMethods((store) => ({
    saveAuthentication(authentication: Authentication): void {
      patchState(store, { authentication });
    },
    getAuthentication(): Authentication | null {
      return store.authentication();
    },
    clearAuthentication(): void {
      patchState(store, { authentication: null });
      try {
        sessionStorage.removeItem('AuthenticationStore');
      } catch {
        // ignore
      }
    },
    isAuthenticated(): boolean {
      return store.authentication() !== null;
    },
  })),
);
