# Feed Admin Backend

Simple Node.js backend for managing admin DIDs and feeds.

## Local Development

```bash
cd feed-admin
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `API_KEY` | `change-me-in-production` | API key for admin endpoints |
| `DATA_DIR` | `./data` | Directory for JSON data files |

## API Endpoints

### Public (no auth required)

- `GET /health` - Health check
- `GET /public/admin-dids` - Get list of admin DIDs
- `GET /public/is-admin/:did` - Check if DID is admin

### Protected (requires `X-API-KEY` header)

#### Admins
- `GET /api/admins` - List all admins
- `GET /api/admins/:did` - Get admin by DID
- `POST /api/admins` - Add admin `{did, handle?}`
- `DELETE /api/admins/:did` - Remove admin

#### Feeds
- `GET /api/feeds` - List all feeds
- `GET /api/feeds/:id` - Get feed by ID
- `POST /api/feeds` - Add feed `{uri, displayName, ...}`
- `PUT /api/feeds/:id` - Update feed
- `DELETE /api/feeds/:id` - Remove feed
- `POST /api/feeds/:id/pin` - Pin/unpin `{isPinned}`
- `POST /api/feeds/:id/mandatory` - Set mandatory `{isMandatory}`
- `POST /api/feeds/reorder` - Reorder `{feedIds: []}`

## Docker

```bash
# Build
docker build -t feed-admin .

# Run
docker run -d \
  -p 3001:3001 \
  -e API_KEY=your-secret-key \
  -v feed-admin-data:/app/data \
  --name feed-admin \
  feed-admin
```

## Server Deployment

```bash
# 1. Clone and navigate to feed-admin
cd /opt/feed-admin

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Create systemd service (see below) or use PM2
pm2 start dist/index.js --name feed-admin

# 5. Set environment variables
export API_KEY=your-secret-key
export DATA_DIR=/var/lib/feed-admin
```

### Systemd Service

Create `/etc/systemd/system/feed-admin.service`:

```ini
[Unit]
Description=Feed Admin Backend
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/feed-admin
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=API_KEY=your-secret-key
Environment=DATA_DIR=/var/lib/feed-admin

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable feed-admin
sudo systemctl start feed-admin
```
