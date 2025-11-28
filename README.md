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

```

2. Install and run:

```
npm i
npm run start:dev
```
or deploy docker-package

3. API Endpoints:
- `POST /tenant` - create a new tenant with full environment (default context, queue, ivr, inbound-route), separated from others tenants 
- `POST /tenant/:id/extension` - create a new pjsip-extension for tenant <id>
- `GET /tenant/:id/extensions` - get a list of extensions for tenant <id>

4. Swagger UI:
- Available at `/api` when the app is running.
