import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Supabase configuration
// Supports both process.env (for .env files with babel plugins) and app.json extra field
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.supabaseUrl ||
  '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  '';

const isValidUrl = (s: string) => /^https?:\/\/.+/.test(s);

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  throw new Error(
    'Invalid Supabase config. Add valid EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to frontend/.env. ' +
      'Get them from https://app.supabase.com/project/_/settings/api. Restart the dev server after changing .env.'
  );
}

// Storage: SecureStore on native, localStorage on web (expo-secure-store is not available on web)
const storage =
  Platform.OS === 'web'
    ? {
        getItem: (key: string) => Promise.resolve(typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null),
        setItem: (key: string, value: string) => {
          if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : (() => {
        const { getItemAsync, setItemAsync, deleteItemAsync } = require('expo-secure-store');
        return {
          getItem: (key: string) => getItemAsync(key),
          setItem: (key: string, value: string) => setItemAsync(key, value),
          removeItem: (key: string) => deleteItemAsync(key),
        };
      })();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    flowType: 'pkce',
    detectSessionInUrl: Platform.OS === 'web', // Web can parse callback URL automatically; native uses auth/callback route
  },
});
