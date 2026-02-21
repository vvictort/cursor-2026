import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

const AUTH_CALLBACK_ROUTE = 'auth/callback';
const AUTH_CALLBACK_PATH = '/auth/callback';
const LOCAL_WEB_CALLBACK_URL = `http://localhost:8081${AUTH_CALLBACK_PATH}`;
const LOCAL_WEB_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export function getAuthRedirectUrl() {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.origin) {
      try {
        const currentUrl = new URL(window.location.origin);
        if (LOCAL_WEB_HOSTS.has(currentUrl.hostname)) {
          return `${stripTrailingSlash(window.location.origin)}${AUTH_CALLBACK_PATH}`;
        }
      } catch {
        // Fall through to localhost callback below.
      }
    }

    return LOCAL_WEB_CALLBACK_URL;
  }

  return Linking.createURL(AUTH_CALLBACK_ROUTE);
}
