import { Router, Request, Response } from 'express';
import { sendSms } from '../services/sms.js';
import { env } from '../config/env.js';
import { isValidPersonId } from '../utils/validate.js';
import { FIVE_MIN_MS } from '../utils/time.js';

// Demo window: 5 min. Swap to e.g. 24 * 60 * 60 * 1000 for prod.
const WINDOW_MS = FIVE_MIN_MS;

const router = Router();

type PersonSchedule = {
  personId: string;
  deadlineMs: number;
  timer: ReturnType<typeof setTimeout>;
  lastCheckinMs: number | null;
  lastAlertMs: number | null;
  windowIndex: number;
};

const schedules = new Map<string, PersonSchedule>();

function scheduleOrReschedule(personId: string, reason: 'enroll' | 'checkin' | 'fired'): void {
  const existing = schedules.get(personId);
  if (existing) clearTimeout(existing.timer);

  const prevIndex = existing?.windowIndex ?? 0;
  const nextIndex = prevIndex + 1;
  const deadlineMs = Date.now() + WINDOW_MS;

  const myIndex = nextIndex;

  const timer = setTimeout(async () => {
    const current = schedules.get(personId);
    if (!current || current.windowIndex !== myIndex) return; // stale timer guard

    console.log(`[checkin] timer fired for ${personId} (window ${myIndex})`);

    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const body = `Check-in alert: ${personId} has not checked in within the window. (${time})`;
    try {
      await sendSms({ to: env.DEMO_TO_PHONE, body });
      current.lastAlertMs = Date.now();
    } catch (err) {
      console.error(`[checkin] SMS failed for ${personId}:`, err);
    }

    scheduleOrReschedule(personId, 'fired');
  }, WINDOW_MS);

  const next: PersonSchedule = {
    personId,
    deadlineMs,
    timer,
    lastCheckinMs: existing?.lastCheckinMs ?? null,
    lastAlertMs: existing?.lastAlertMs ?? null,
    windowIndex: nextIndex,
  };

  schedules.set(personId, next);
  console.log(`[checkin] scheduled window ${nextIndex} for ${personId} (reason=${reason}, deadline=${new Date(deadlineMs).toISOString()})`);
}

// Seed Andy on startup
scheduleOrReschedule('Andy', 'enroll');

router.get('/checkin/:personId', async (req: Request, res: Response) => {
  const { personId } = req.params;
  if (!isValidPersonId(personId)) {
    res.status(400).json({ error: 'Invalid personId (max 64 chars)' });
    return;
  }

  const isNew = !schedules.has(personId);
  if (isNew) {
    scheduleOrReschedule(personId, 'enroll');
  }

  const schedule = schedules.get(personId)!;
  schedule.lastCheckinMs = Date.now();

  scheduleOrReschedule(personId, 'checkin');

  const s = schedules.get(personId)!;
  res.json({
    personId: s.personId,
    deadlineMs: s.deadlineMs,
    deadline: new Date(s.deadlineMs).toISOString(),
    lastCheckinMs: s.lastCheckinMs,
    lastCheckin: s.lastCheckinMs ? new Date(s.lastCheckinMs).toISOString() : null,
    lastAlertMs: s.lastAlertMs,
    lastAlert: s.lastAlertMs ? new Date(s.lastAlertMs).toISOString() : null,
  });
});

router.post('/checkin/:personId/notify', async (req: Request, res: Response) => {
  const { personId } = req.params;
  if (!isValidPersonId(personId)) {
    res.status(400).json({ error: 'Invalid personId (max 64 chars)' });
    return;
  }

  try {
    const body = `Check-in alert: ${personId} has not checked in within the window.`;
    const result = await sendSms({ to: env.DEMO_TO_PHONE, body });
    res.json({ sid: result.sid, status: result.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
