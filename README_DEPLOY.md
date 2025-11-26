# 🚀 MangaReader CMS Deployment Guide

## 📋 Overview

This is the admin CMS for MangaReader, replacing the old `datn-admin`. Built with:
- React 19
- Vite 7
- TypeScript
- Ant Design 5
- TanStack Router

## 🛠️ Setup on VPS

### 1. Clone repository

```bash
ssh root@157.66.101.220
cd /opt
git clone https://github.com/pthieenlong/mangareader-cms.git
cd mangareader-cms
```

### 2. Create .env file

```bash
cp .env.example .env
# Edit .env with your configuration
nano .env
```

### 3. Build and run with docker-compose

```bash
# From /opt directory
cd /opt
docker-compose build cms
docker-compose up -d cms
```

### 4. Check logs

```bash
docker logs mangareader-cms --tail 50
```

## 🔄 Deploy Updates

### Manual deploy on VPS:

```bash
ssh root@157.66.101.220
cd /opt/mangareader-cms
./deploy-vps.sh
```

### Or from local machine:

```bash
ssh root@157.66.101.220 "cd /opt/mangareader-cms && ./deploy-vps.sh"
```

## 🌐 Access

- **Production:** http://157.66.101.220:5174
- **Local:** http://localhost:5174

## 📦 Ports

- **5173** - Old datn-admin (can be stopped if not needed)
- **5174** - New mangareader-cms

## 🔧 Useful Commands

### View logs:
```bash
docker logs mangareader-cms --tail 50 -f
```

### Restart service:
```bash
docker-compose restart cms
```

### Rebuild and restart:
```bash
cd /opt
docker-compose stop cms
docker-compose rm -f cms
docker-compose build cms
docker-compose up -d cms
```

### Check status:
```bash
docker ps | grep mangareader-cms
```

## ⚠️ Important Notes

- ✅ Deploy script uses `stop`/`rm` instead of `down` to prevent data loss
- ✅ Only rebuilds CMS container, doesn't touch database or other services
- ✅ Auto-cleanup of unused Docker images after deploy
- ⚠️ Never run `docker-compose down -v` as it will delete database volumes

## 🎯 First Time Setup on VPS

```bash
# 1. SSH to VPS
ssh root@157.66.101.220

# 2. Clone repo
cd /opt
git clone https://github.com/pthieenlong/mangareader-cms.git

# 3. Setup environment
cd mangareader-cms
cp .env.example .env

# 4. Build and start
cd /opt
docker-compose build cms
docker-compose up -d cms

# 5. Check it's running
docker ps | grep mangareader-cms
docker logs mangareader-cms --tail 50

# 6. Test access
curl http://localhost:5174
```

## 📝 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml` in the repository:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main, production ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/mangareader-cms
            export BRANCH=${{ github.ref_name }}
            ./deploy-vps.sh
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://157.66.101.220:3000` |
| `NODE_ENV` | Environment | `production` |

## 🆘 Troubleshooting

### Container not starting:
```bash
docker logs mangareader-cms
```

### Port already in use:
```bash
# Check what's using port 5174
sudo lsof -i :5174

# Change port in docker-compose.yml if needed
```

### Build fails:
```bash
# Clear build cache
docker builder prune -a

# Rebuild from scratch
docker-compose build --no-cache cms
```

