import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example API route for mobile app
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// Twilio SMS test endpoint
app.post('/api/sms/test', async (req, res) => {
  try {
    const to = process.env.TEST_DESTINATION_NUMBER;
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!to || !from) {
      return res.status(500).json({
        error: 'Missing TEST_DESTINATION_NUMBER or TWILIO_PHONE_NUMBER in .env',
      });
    }

    const message = await twilioClient.messages.create({
      body: 'hello hello',
      from,
      to,
    });

    res.json({ success: true, sid: message.sid });
  } catch (err) {
    console.error('Twilio SMS error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
