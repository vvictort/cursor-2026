import { Router } from 'express';
import { requireDemoKey } from '../middleware/requireDemoKey.js';
import smsTestRouter from './smsTest.js';
import checkinRouter from './checkin.js';

const router = Router();

// Health check (no auth)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example route for mobile app (no auth)
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// Demo-protected routes
router.use(requireDemoKey);
router.use(smsTestRouter);
router.use(checkinRouter);

export default router;
