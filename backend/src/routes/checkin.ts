import { Router, Request, Response } from 'express';
import { sendSms } from '../services/sms.js';
import { env } from '../config/env.js';
import { isValidPersonId } from '../utils/validate.js';
import { FIVE_MIN_MS } from '../utils/time.js';

const router = Router();

// personId -> lastSeen (ms since epoch)
const lastSeenMap = new Map<string, number>();

router.get('/checkin/:personId', async (req: Request, res: Response) => {
  const { personId } = req.params;
  if (!isValidPersonId(personId)) {
    res.status(400).json({ error: 'Invalid personId (max 64 chars)' });
    return;
  }

  const now = Date.now();
  const lastSeen = lastSeenMap.get(personId);

  if (lastSeen === undefined) {
    lastSeenMap.set(personId, now);
    res.json({ personId, lastSeen: new Date(now).toISOString(), notified: false });
    return;
  }

  const elapsed = now - lastSeen;
  if (elapsed > FIVE_MIN_MS) {
    const body = `Check-in missed: personId=${personId} has not checked in for over 5 minutes.`;
    await sendSms({ to: env.DEMO_TO_PHONE, body });
    lastSeenMap.set(personId, now);
    res.json({ personId, lastSeen: new Date(now).toISOString(), notified: true });
    return;
  }

  lastSeenMap.set(personId, now);
  res.json({ personId, lastSeen: new Date(now).toISOString(), notified: false });
});

router.post('/checkin/:personId/notify', async (req: Request, res: Response) => {
  const { personId } = req.params;
  if (!isValidPersonId(personId)) {
    res.status(400).json({ error: 'Invalid personId (max 64 chars)' });
    return;
  }

  try {
    const body = `Check-in missed: personId=${personId} has not checked in for over 5 minutes.`;
    const result = await sendSms({ to: env.DEMO_TO_PHONE, body });
    res.json({ sid: result.sid, status: result.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
