import { Router, Request, Response } from 'express';
import { sendSms } from '../services/sms.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/sms/test', async (req: Request, res: Response) => {
  try {
    const to = (req.body?.to as string) || env.DEMO_TO_PHONE;
    const body = (req.body?.body as string) || 'Test SMS from demo';

    const result = await sendSms({ to, body });
    res.json({ sid: result.sid, status: result.status, to: result.to, from: result.from });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
