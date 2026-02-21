import app from './app.js';
import { env } from './config/env.js';
import { startWindowScheduler } from './scheduler/checkinWindow.js';

startWindowScheduler();

setInterval(() => console.log('[tick]', new Date().toISOString()), 10_000);

app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
