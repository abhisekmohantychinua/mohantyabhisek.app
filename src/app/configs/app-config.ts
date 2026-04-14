import { environment } from '../../environments/environment';

function requireEnv<T>(name: string, value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new Error(`Environment value '${name}' is not defined.`);
  }
  return value;
}

export const BASE_URL = String(requireEnv('BASE_URL', environment.baseUrl));
export const API_VERSION = Number(requireEnv('API_VERSION', environment.apiVersion));

if (Number.isNaN(API_VERSION)) {
  throw new Error("Environment value 'API_VERSION' must be a valid number.");
}
