import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function requireDemoKey(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-demo-key'];
  if (key !== env.DEMO_KEY) {
    res.status(401).json({ error: 'Invalid or missing x-demo-key header' });
    return;
  }
  next();
}
