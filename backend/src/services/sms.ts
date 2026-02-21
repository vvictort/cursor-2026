import { twilioClient } from '../config/twilio.js';
import { env } from '../config/env.js';

export interface SendSmsOptions {
  to?: string;
  body: string;
}

export async function sendSms({ to = env.DEMO_TO_PHONE, body }: SendSmsOptions) {
  console.log('[SMS] sendSms called', { to, body });
  const message = await twilioClient.messages.create({
    body,
    from: env.TWILIO_PHONE_NUMBER,
    to,
  });
  return { sid: message.sid, status: message.status, to, from: env.TWILIO_PHONE_NUMBER };
}
