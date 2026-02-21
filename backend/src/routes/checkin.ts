import { Router, Request, Response } from 'express';
import { sendSms } from '../services/sms.js';
import { env } from '../config/env.js';
import { isValidPersonId } from '../utils/validate.js';
import { markCheckedIn, getWindowStatus, WINDOW_MS, checkedInWindow } from '../scheduler/checkinWindow.js';

const router = Router();

// GET /api/checkin/window — debug: current scheduler state
router.get('/checkin/window', (_req: Request, res: Response) => {
  res.json(getWindowStatus());
});

// GET /api/checkin/:personId — record a check-in
router.get('/checkin/:personId', (req: Request, res: Response) => {
  const { personId } = req.params;
  if (!isValidPersonId(personId)) {
    res.status(400).json({ error: 'Invalid personId (max 64 chars)' });
    return;
  }

  markCheckedIn(personId);
  console.log('[checkin] map state:', Object.fromEntries(checkedInWindow));

  const now = Date.now();
  res.json({
    personId,
    checkedIn: true,
    serverTime: new Date(now).toISOString(),
    windowMs: WINDOW_MS,
  });
});

// POST /api/checkin/:personId/notify — manual alert trigger
router.post('/checkin/:personId/notify', async (req: Request, res: Response) => {
  const { personId } = req.params;
  if (!isValidPersonId(personId)) {
    res.status(400).json({ error: 'Invalid personId (max 64 chars)' });
    return;
  }

  try {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const body = `Check-in alert: ${personId} has not checked in within the window. (${time})`;
    const result = await sendSms({ to: env.DEMO_TO_PHONE, body });
    res.json({ sid: result.sid, status: result.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
