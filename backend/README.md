# cursor-2026 Backend

Express + TypeScript API with Twilio SMS and family check-in.

## Setup

```bash
cp .env.example .env
# Edit .env with your Twilio credentials and DEMO_KEY
npm install
```

## Run

```bash
npm run dev   # watch mode
npm start     # production
```

## API

All demo endpoints require header: `x-demo-key: <DEMO_KEY>`

### Health (no auth)

```bash
curl http://localhost:3000/api/health
```

### Test SMS

```bash
curl -X POST http://localhost:3000/api/sms/test \
  -H "Content-Type: application/json" \
  -H "x-demo-key: demo-secret" \
  -d '{}'
# Defaults: to=DEMO_TO_PHONE, body="Test SMS from demo"

curl -X POST http://localhost:3000/api/sms/test \
  -H "Content-Type: application/json" \
  -H "x-demo-key: demo-secret" \
  -d '{"to":"+1234567890","body":"Custom message"}'
```

### Check-in

```bash
# GET - check in (sends SMS if >5 min since last)
curl -H "x-demo-key: demo-secret" http://localhost:3000/api/checkin/alice

# POST - manual notify (always sends SMS)
curl -X POST -H "x-demo-key: demo-secret" http://localhost:3000/api/checkin/alice/notify
```
