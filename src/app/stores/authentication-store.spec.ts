import { TestBed } from '@angular/core/testing';

import type { Authentication } from '../models/authentication';
import { AuthenticationStore } from './authentication-store';

describe('AuthenticationStore', () => {
  let store: InstanceType<typeof AuthenticationStore>;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(AuthenticationStore);
  });

  describe('saveAuthentication', () => {
    it('should store the authentication object', () => {
      const auth: Authentication = { token: 'abc' };
      store.saveAuthentication(auth);
      expect(store.authentication()).toEqual(auth);
    });
  });

  describe('getAuthentication', () => {
    it('should return null when no authentication is saved', () => {
      expect(store.getAuthentication()).toBeNull();
    });

    it('should return the saved authentication', () => {
      const auth: Authentication = { token: 'abc' };
      store.saveAuthentication(auth);
      expect(store.getAuthentication()).toEqual(auth);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no authentication is saved', () => {
      expect(store.isAuthenticated()).toBe(false);
    });

    it('should return true after saving authentication', () => {
      store.saveAuthentication({ token: 'abc' });
      expect(store.isAuthenticated()).toBe(true);
    });
  });

  describe('clearAuthentication', () => {
    it('should remove the stored authentication', () => {
      store.saveAuthentication({ token: 'abc' });
      store.clearAuthentication();
      expect(store.getAuthentication()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
    });

    it('should remove the sessionStorage entry', () => {
      store.saveAuthentication({ token: 'abc' });
      store.clearAuthentication();
      expect(sessionStorage.getItem('AuthenticationStore')).toBeNull();
    });
  });

  describe('session storage hydration', () => {
    it('should persist state to sessionStorage on change', async () => {
      const auth: Authentication = { token: 'xyz' };
      store.saveAuthentication(auth);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const raw = sessionStorage.getItem('AuthenticationStore');
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual({ authentication: auth });
    });

    it('should hydrate state from sessionStorage on init', () => {
      const auth: Authentication = { token: 'hydrated' };
      sessionStorage.setItem('AuthenticationStore', JSON.stringify({ authentication: auth }));

      // Create a fresh store instance to trigger onInit hydration
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshStore = TestBed.inject(AuthenticationStore);
      expect(freshStore.getAuthentication()).toEqual(auth);
    });

    it('should handle malformed sessionStorage data gracefully', () => {
      sessionStorage.setItem('AuthenticationStore', 'not-valid-json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshStore = TestBed.inject(AuthenticationStore);
      expect(freshStore.getAuthentication()).toBeNull();
    });
  });
});
