import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  TWILIO_ACCOUNT_SID: requireEnv('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN: requireEnv('TWILIO_AUTH_TOKEN'),
  TWILIO_PHONE_NUMBER: requireEnv('TWILIO_PHONE_NUMBER'),
  DEMO_TO_PHONE: requireEnv('DEMO_TO_PHONE'),
  DEMO_KEY: requireEnv('DEMO_KEY'),
} as const;
