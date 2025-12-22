# 🚀 Hướng dẫn Deploy Admin CMS lên VPS

## 📋 Tổng quan

Admin CMS (MangaReader CMS) là ứng dụng React + Vite để quản lý toàn bộ hệ thống.

**Domain:** https://admin.mangareader.io.vn  
**Port:** 5173  
**Container:** mangareader-cms

---

## 🎯 Bước 1: Chuẩn bị trên VPS

### 1.1. SSH vào VPS

```bash
ssh root@180.93.42.9
```

### 1.2. Kiểm tra và clone code (nếu chưa có)

```bash
# Kiểm tra xem đã có code chưa
cd /opt
ls -la

# Nếu chưa có thư mục mangareader-cms, clone về
cd /opt
git clone git@github.com:pthieenlong/mangareader-cms.git

# Nếu đã có, pull code mới nhất
cd /opt/mangareader-cms
git pull origin dev
```

### 1.3. Kiểm tra docker-compose.yml ở /opt

```bash
cd /opt
cat docker-compose.yml | grep -A 20 "cms:"
```

Đảm bảo có service `cms` như sau:

```yaml
cms:
  build:
    context: ./mangareader-cms
    dockerfile: Dockerfile
    args:
      VITE_API_URL: https://api.mangareader.io.vn
  image: mangareader-cms:local
  container_name: mangareader-cms
  ports:
    - "5173:5173"
  depends_on:
    - api
  networks:
    - datn_network
  restart: unless-stopped
```

---

## 🎯 Bước 2: Setup Nginx

### 2.1. Copy nginx config lên VPS

```bash
# Trên máy local (trong terminal)
cd /Users/mac/Documents/code/datn

# Copy nginx config lên VPS
scp nginx-configs/admin.mangareader.io.vn.conf root@180.93.42.9:/etc/nginx/sites-available/
```

### 2.2. Kích hoạt config trên VPS

```bash
# SSH vào VPS
ssh root@180.93.42.9

# Tạo symbolic link
sudo ln -sf /etc/nginx/sites-available/admin.mangareader.io.vn.conf /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 🎯 Bước 3: Build và Deploy

### 3.1. Build container

```bash
# SSH vào VPS
ssh root@180.93.42.9

cd /opt

# Build CMS service
docker compose build cms

# Hoặc build với --no-cache nếu cần
docker compose build --no-cache cms
```

### 3.2. Start container

```bash
# Stop container cũ (nếu có)
docker compose stop cms
docker compose rm -f cms

# Start container mới
docker compose up -d cms

# Kiểm tra logs
docker logs mangareader-cms -f
```

### 3.3. Kiểm tra container đang chạy

```bash
# Xem status
docker ps | grep mangareader-cms

# Xem logs chi tiết
docker logs mangareader-cms --tail 100
```

---

## 🎯 Bước 4: Setup SSL với Certbot

### 4.1. Chạy Certbot

```bash
# SSH vào VPS
ssh root@180.93.42.9

# Chạy certbot cho admin subdomain
sudo certbot --nginx -d admin.mangareader.io.vn

# Hoặc chạy cho tất cả domains cùng lúc
sudo certbot --nginx -d mangareader.io.vn -d www.mangareader.io.vn -d api.mangareader.io.vn -d admin.mangareader.io.vn
```

### 4.2. Test auto-renewal

```bash
sudo certbot renew --dry-run
```

---

## 🎯 Bước 5: Kiểm tra hoạt động

### 5.1. Kiểm tra service

```bash
# Check port 5173 đang lắng nghe
sudo netstat -tlnp | grep 5173

# Check container health
docker inspect mangareader-cms | grep -A 10 Health
```

### 5.2. Test trên browser

- Mở http://180.93.42.9:5173 (nếu chưa setup domain)
- Mở http://admin.mangareader.io.vn (sau khi setup nginx)
- Mở https://admin.mangareader.io.vn (sau khi setup SSL)

### 5.3. Kiểm tra logs

```bash
# Container logs
docker logs mangareader-cms --tail 50

# Nginx access logs
sudo tail -f /var/log/nginx/admin.mangareader.io.vn.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/admin.mangareader.io.vn.error.log
```

---

## 🔄 Deploy lại khi có code mới

### Cách 1: Sử dụng script deploy-vps.sh

```bash
# SSH vào VPS
ssh root@180.93.42.9

# Chạy script deploy
cd /opt/mangareader-cms
./deploy-vps.sh

# Hoặc deploy branch khác
BRANCH=main ./deploy-vps.sh
```

### Cách 2: Manual deploy

```bash
# SSH vào VPS
ssh root@180.93.42.9

cd /opt/mangareader-cms

# Pull code mới
git pull origin dev

# Rebuild container
cd /opt
docker compose stop cms
docker compose rm -f cms
docker compose build cms
docker compose up -d cms

# Check logs
docker logs mangareader-cms -f
```

---

## 🐛 Troubleshooting

### Container không start được

```bash
# Xem logs chi tiết
docker logs mangareader-cms

# Kiểm tra port conflict
sudo netstat -tlnp | grep 5173

# Restart container
docker compose restart cms
```

### Nginx error 502 Bad Gateway

```bash
# Kiểm tra container có đang chạy không
docker ps | grep mangareader-cms

# Kiểm tra port 5173
curl http://localhost:5173

# Check nginx error logs
sudo tail -f /var/log/nginx/admin.mangareader.io.vn.error.log
```

### Build bị lỗi

```bash
# Build với --no-cache
docker compose build --no-cache cms

# Xem build logs chi tiết
docker compose build cms --progress=plain

# Xóa cache và rebuild
docker builder prune -a
docker compose build cms
```

### SSL certificate không renew

```bash
# Test renewal
sudo certbot renew --dry-run

# Force renew
sudo certbot renew --force-renewal

# Check certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## 📝 Lưu ý

1. **API URL**: Container build với `VITE_API_URL: https://api.mangareader.io.vn`

   - Đảm bảo API đã deploy và hoạt động trước
   - Kiểm tra CORS settings trên API

2. **Port mapping**: Container expose port 5173

   - Nginx proxy từ 80/443 → 5173
   - Không cần mở port 5173 ra ngoài firewall

3. **Dependencies**: CMS phụ thuộc vào API service

   - Đảm bảo API container đang chạy
   - Check `docker compose ps` để xem tất cả services

4. **Environment variables**: Build-time variables

   - VITE_API_URL được set khi build container
   - Nếu thay đổi API URL, cần rebuild container

5. **Static files**: SPA routing
   - Nginx phải proxy tất cả requests về container
   - Container dùng `serve -s` để handle SPA routing

---

## ✅ Checklist Deploy

- [ ] SSH được vào VPS
- [ ] Code đã được clone về /opt/mangareader-cms
- [ ] docker-compose.yml có service cms
- [ ] Nginx config đã được copy lên VPS
- [ ] Nginx config đã được enable
- [ ] Container cms đã được build
- [ ] Container cms đang chạy (docker ps)
- [ ] Port 5173 đang lắng nghe
- [ ] Nginx test OK (sudo nginx -t)
- [ ] HTTP access OK (http://admin.mangareader.io.vn)
- [ ] SSL certificate đã được setup
- [ ] HTTPS access OK (https://admin.mangareader.io.vn)
- [ ] Login được vào admin panel
- [ ] API calls hoạt động bình thường

---

## 🔗 Links quan trọng

- **Production URL**: https://admin.mangareader.io.vn
- **Container name**: mangareader-cms
- **Port**: 5173
- **API**: https://api.mangareader.io.vn
- **Logs**: /var/log/nginx/admin.mangareader.io.vn.\*.log
