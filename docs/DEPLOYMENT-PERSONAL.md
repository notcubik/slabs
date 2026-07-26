# Personal Server Deployment Guide

Step-by-step instructions to deploy Slabs on your own server.

## Prerequisites

- A server with Docker and Docker Compose installed
- A domain name (optional but recommended)
- Git and a GitHub account

---

## Step 1: Upload to GitHub

```bash
cd /path/to/Slabs

git init
git add .
git commit -m "Initial commit: Slabs"
git branch -M main

# Create the repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/slabs.git
git push -u origin main
```

## Step 2: Create the Docker Compose File

Create `docker-compose.yml` on your server:

```yaml
services:
  slabs:
    image: ghcr.io/notcubik/slabs:latest
    container_name: slabs
    ports:
      - "3000:3000"
    volumes:
      - slabs-data:/data
    environment:
      - NODE_ENV=production
      - DATA_DIR=/data
      - DATABASE_URL=/data/slabs.db
      - ORIGIN=https://notes.yourdomain.com
    restart: unless-stopped

volumes:
  slabs-data:
```

## Step 3: Start the Server

```bash
docker compose up -d
```

Open **http://your-server-ip:3000** in your browser. Create your admin account on first visit.

## Step 4: Set Up HTTPS with Caddy (Recommended)

Install Caddy on your server:

```bash
# Debian/Ubuntu
sudo apt install -y caddy

# Or use Docker
docker run -d --name caddy \
  -p 80:80 -p 443:443 \
  -v /etc/caddy/Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data:/data \
  caddy:latest
```

Create `/etc/caddy/Caddyfile`:

```
notes.yourdomain.com {
    reverse_proxy localhost:3000
}
```

Restart Caddy:

```bash
sudo systemctl restart caddy
```

Caddy automatically provisions HTTPS via Let's Encrypt.

## Step 5: Configure OAuth/SSO (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add `https://notes.yourdomain.com/api/auth/oauth/google/callback` as redirect URI

Add to `docker-compose.yml`:

```yaml
environment:
  - AUTH_GOOGLE_CLIENT_ID=your-client-id
  - AUTH_GOOGLE_CLIENT_SECRET=your-client-secret
```

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL to `https://notes.yourdomain.com/api/auth/oauth/github/callback`

```yaml
environment:
  - AUTH_GITHUB_CLIENT_ID=your-client-id
  - AUTH_GITHUB_CLIENT_SECRET=your-client-secret
```

### OIDC (Authentik, Keycloak, etc.)

```yaml
environment:
  - AUTH_OIDC_ISSUER=https://auth.yourdomain.com/application/o/slabs/
  - AUTH_OIDC_CLIENT_ID=your-client-id
  - AUTH_OIDC_CLIENT_SECRET=your-client-secret
  - AUTH_OIDC_DISPLAY_NAME=Authentik
```

See [AUTH.md](AUTH.md) for detailed provider setup guides.

## Step 6: Enable Email Notifications (Optional)

Add SMTP settings to receive email notifications for shares, security alerts, and account events:

```yaml
environment:
  - SMTP_HOST=smtp.yourdomain.com
  - SMTP_PORT=587
  - SMTP_USER=your-email
  - SMTP_PASS=your-password
  - SMTP_FROM=Slabs <noreply@yourdomain.com>
```

## Step 7: Backups

Back up the SQLite database and attachments:

```bash
# Create backup
docker compose exec slabs tar czf - /data > slabs-backup-$(date +%Y%m%d).tar.gz

# Or copy data out
docker cp slabs:/data ./backup

# Restore
docker cp ./backup slabs:/data
docker compose restart slabs
```

Set up a cron job for automatic backups:

```bash
# Edit crontab
crontab -e

# Add daily backup at 3 AM
0 3 * * * docker compose exec slabs tar czf - /data > /backups/slabs-$(date +\%Y\%m\%d).tar.gz
```

## Step 8: Updates

Pull the latest image and restart:

```bash
docker compose pull
docker compose up -d
```

## Step 9: Verify

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f slabs

# Health check
docker inspect --format='{{.State.Health.Status}}' slabs
```

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `/data/slabs.db` | SQLite database path |
| `ORIGIN` | `http://localhost:3000` | Public URL (needed for OAuth) |
| `PORT` | `3000` | Server port |
| `SMTP_HOST` | — | SMTP server for emails |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | — | SMTP username |
| `SMTP_PASS` | — | SMTP password |
| `SMTP_FROM` | `Slabs <noreply@localhost>` | Sender address |
| `AUTH_GOOGLE_CLIENT_ID` | — | Google OAuth client ID |
| `AUTH_GOOGLE_CLIENT_SECRET` | — | Google OAuth client secret |
| `AUTH_GITHUB_CLIENT_ID` | — | GitHub OAuth client ID |
| `AUTH_GITHUB_CLIENT_SECRET` | — | GitHub OAuth client secret |
| `AUTH_OIDC_ISSUER` | — | OIDC issuer URL |
| `AUTH_OIDC_CLIENT_ID` | — | OIDC client ID |
| `AUTH_OIDC_CLIENT_SECRET` | — | OIDC client secret |
| `AUTH_OIDC_DISPLAY_NAME` | — | OIDC provider display name |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect | Check `docker compose logs slabs` for errors |
| OAuth redirect fails | Ensure `ORIGIN` matches your public URL exactly |
| Database locked | Stop all containers, then restart |
| Slow performance | Move SQLite data to an SSD-backed volume |

---

Forked from [Crumbs by Bretzel](https://github.com/bretzel-app/crumbs). MIT License.
