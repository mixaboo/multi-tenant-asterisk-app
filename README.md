## Quick start

1. Copy `.env.example` to `.env` and adjust values if needed:

```
PORT=3000

# MySQL connection (Asterisk Realtime DB)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=asterisk
MYSQL_PASSWORD=asterisk
MYSQL_DATABASE=asterisk

# TypeORM runtime options
TYPEORM_SYNC=false
TYPEORM_LOGGING=false

# Pathes for asterisk - we need it for creating directories for each tenant
ASTERISK_CONFIG_DIR=/etc/asterisk
ASTERISK_MONITOR_DIR=/var/spool/asterisk/monitor
ASTERISK_SOUNDS_DIR=/var/lib/asterisk/sounds

```

2. Install and run:

```
npm i
npm run start:dev
```

3. API Endpoints:
- `POST /tenant` - create a new tenant
- `POST /tenant/:id/extension` - create a new pjsip-extensin for tenant <id>
- `GET /tenant/:id/extensions` - get a list of extensions for tenant <id>

4. Swagger UI:
- Available at `/api` when the app is running.
