## Quick start 

1. Copy `.env.example` to `.env` and adjust values if needed:

```
PORT=3000
ASTERISK_CONFIG_DIR=/etc/asterisk
ASTERISK_MONITOR_DIR=/var/spool/asterisk/monitor
ASTERISK_SOUNDS_DIR=/var/lib/asterisk/sounds
```

2. Install and run:

```
npm install
npm run start:dev
```

3. Endpoints (stubbed):
- `POST /tenant` — create new tenant
- `POST /tenant/:id/extension` — create new extension for tenant<:id>
- `GET /tenant/:id/extensions` — get list of extensions for tenant<:id>
