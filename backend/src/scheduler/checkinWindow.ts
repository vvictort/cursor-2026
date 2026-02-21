import { sendSms } from '../services/sms.js';
import { env } from '../config/env.js';
import { FIVE_MIN_MS } from '../utils/time.js';

// Configurable window length
export const WINDOW_MS = FIVE_MIN_MS;

// personId -> checked in at least once this window
export const checkedInWindow = new Map<string, boolean>();

let isRunning = false;
let lastRunMs: number | null = null;

async function runWindow(): Promise<void> {
  if (isRunning) return;
  isRunning = true;

  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  console.log(`[scheduler] window scan started at ${time}`);

  try {
    const alerts: Promise<void>[] = [];

    for (const [personId, checkedIn] of checkedInWindow.entries()) {
      if (!checkedIn) {
        console.log(`[scheduler] no check-in for ${personId} — sending SMS`);
        const body = `Check-in alert: ${personId} has not checked in within the window. (${time})`;
        alerts.push(
          sendSms({ to: env.DEMO_TO_PHONE, body })
            .then(() => console.log(`[scheduler] SMS sent for ${personId}`))
            .catch((err) => console.error(`[scheduler] SMS failed for ${personId}:`, err))
        );
      }
    }

    await Promise.all(alerts);

    // Reset all to false for next window (keep keys — enrollment is stable)
    for (const personId of checkedInWindow.keys()) {
      checkedInWindow.set(personId, false);
    }

    lastRunMs = Date.now();
    console.log(`[scheduler] window reset complete`);
  } finally {
    isRunning = false;
  }
}

export function markCheckedIn(personId: string): void {
  const existed = checkedInWindow.has(personId);
  checkedInWindow.set(personId, true);
  if (existed) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    console.log(`[checkin] ${personId} checked in at ${time}`);
  }
}

let started = false;

export function startWindowScheduler(): void {
  if (started) return;
  started = true;

  // Enroll Andy on startup
  checkedInWindow.set('Andy', false);

  setInterval(runWindow, WINDOW_MS);
  console.log(`[scheduler] started — window=${WINDOW_MS}ms`);
}

export function getWindowStatus() {
  return {
    windowMs: WINDOW_MS,
    lastRunMs,
    lastRun: lastRunMs ? new Date(lastRunMs).toISOString() : null,
    nextRunIn: lastRunMs ? Math.max(0, WINDOW_MS - (Date.now() - lastRunMs)) : null,
    entries: Object.fromEntries(checkedInWindow),
  };
}
