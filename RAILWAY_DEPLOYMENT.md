# Railway Deployment Guide - GitLab CI/CD Integration

## 🚀 Solusi: Deploy dari GitLab ke Railway

Karena Railway native support GitHub tapi project kamu di GitLab, ada 2 solusi:

### **Opsi 1: GitLab CI/CD + Railway CLI (Recommended)** ✅

Menggunakan GitLab CI/CD pipeline untuk otomatis deploy ke Railway setiap ada push ke branch `main`.

#### Setup Steps:

##### 1. Install Railway CLI di Local (untuk setup awal)

```bash
npm install -g @railway/cli
```

##### 2. Login ke Railway

```bash
railway login
```

##### 3. Buat Project di Railway

```bash
# Di root directory project
railway init

# Link ke existing project (jika sudah ada)
railway link
```

Atau buat manual di Railway dashboard: https://railway.app/new

##### 4. Setup Environment Variables di Railway

Buka Railway dashboard → Project → Variables, tambahkan:

```env
DATABASE_URL=mysql+pymysql://user:password@host:port/dbname
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
MYSQL_ROOT_PASSWORD=your-root-password
MYSQL_DATABASE=ragam_bahasa_db
MYSQL_USER=rana_user
MYSQL_PASSWORD=secure_password
PORT=8069
```

##### 5. Setup GitLab CI/CD Variables

Di GitLab: Project → Settings → CI/CD → Variables

Tambahkan variables berikut:

| Variable Name | Value | Protected | Masked |
|--------------|-------|-----------|--------|
| `RAILWAY_TOKEN` | (dapatkan dari `railway login --browserless`) | ✅ | ✅ |
| `RAILWAY_PROJECT_ID` | (dapatkan dari Railway dashboard atau `railway status`) | ✅ | ❌ |
| `RAILWAY_APP_URL` | URL aplikasi Railway kamu | ❌ | ❌ |

**Cara mendapatkan Railway Token:**
```bash
railway login --browserless
# Copy token yang muncul dan paste ke GitLab CI/CD Variables
```

**Cara mendapatkan Project ID:**
```bash
railway status
# Atau lihat di Railway dashboard → Project Settings
```

##### 6. Push ke GitLab

File `.gitlab-ci.yml` sudah dibuat. Sekarang tinggal:

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

GitLab CI/CD akan otomatis:
1. Run tests (jika ada)
2. Deploy backend ke Railway
3. Deploy frontend ke Railway

##### 7. Setup MySQL di Railway

Railway punya MySQL plugin yang bisa langsung dipasang:

```bash
# Di Railway dashboard
railway add mysql

# Atau via CLI
railway add
# Pilih MySQL dari daftar
```

Railway akan auto-generate `DATABASE_URL` environment variable.

##### 8. Update Backend Dockerfile untuk Railway

Backend Dockerfile sudah OK, tapi perlu pastikan menggunakan `$PORT` dari Railway:

```dockerfile
# Sudah benar di Dockerfile kamu
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8069"]
```

Tapi Railway expect environment variable `$PORT`, jadi kita perlu update di `railway.json`:

```json
{
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

---

### **Opsi 2: GitLab Mirror → GitHub → Railway**

Jika kamu lebih suka menggunakan Railway's native GitHub integration:

#### Setup Steps:

##### 1. Buat Repository di GitHub

Buat repo kosong di GitHub (contoh: `ragam-bahasa-nusantara-mirror`)

##### 2. Setup GitLab CI/CD untuk Mirror ke GitHub

Buat file `.gitlab-ci.yml`:

```yaml
stages:
  - mirror

mirror:
  stage: mirror
  image: alpine/git
  script:
    - git remote add github https://$GITHUB_TOKEN@github.com/username/ragam-bahasa-nusantara-mirror.git
    - git push github main --force
  only:
    - main
```

##### 3. Setup GitLab CI/CD Variables

Di GitLab → Settings → CI/CD → Variables:

| Variable Name | Value | Protected | Masked |
|--------------|-------|-----------|--------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | ✅ | ✅ |

**Cara buat GitHub Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Berikan scope: `repo` (Full control of private repositories)
3. Copy token dan paste ke GitLab

##### 4. Connect Railway ke GitHub Repo

1. Buka Railway dashboard
2. New Project → Deploy from GitHub repo
3. Pilih `ragam-bahasa-nusantara-mirror`
4. Railway akan auto-detect Dockerfile dan deploy

---

## 📋 Monitoring & Troubleshooting

### Check Deployment Status

**GitLab CI/CD:**
```
GitLab → Project → CI/CD → Pipelines
```

**Railway:**
```bash
railway status
railway logs
```

**Railway Dashboard:**
```
https://railway.app/project/[your-project-id]
```

### Common Issues

#### 1. Railway Token Invalid

```bash
# Re-login dan dapatkan token baru
railway login --browserless
# Update RAILWAY_TOKEN di GitLab CI/CD Variables
```

#### 2. Build Failed

```bash
# Check logs di Railway dashboard atau
railway logs
```

#### 3. Database Connection Failed

Pastikan `DATABASE_URL` sudah benar:
```bash
railway variables
```

---

## 🎯 Rekomendasi

**Gunakan Opsi 1 (GitLab CI/CD + Railway CLI)** karena:
- ✅ Lebih simple, tidak perlu maintain 2 repos
- ✅ Full control atas deployment process
- ✅ GitLab tetap jadi single source of truth
- ✅ Bisa customize deployment steps
- ✅ Bisa deploy specific services

**Gunakan Opsi 2 (Mirror to GitHub)** jika:
- Kamu lebih suka Railway's native GitHub integration
- Ingin leverage Railway's auto-detect features
- Tidak masalah punya duplicate repo di GitHub

---

## 📚 Resources

- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Docker Deployment](https://docs.railway.app/deploy/dockerfiles)

---

## ✅ Checklist Deployment

- [ ] Install Railway CLI
- [ ] Login ke Railway
- [ ] Buat/link Railway project
- [ ] Setup environment variables di Railway
- [ ] Setup GitLab CI/CD variables (`RAILWAY_TOKEN`, `RAILWAY_PROJECT_ID`)
- [ ] Push `.gitlab-ci.yml` ke GitLab
- [ ] Setup MySQL di Railway
- [ ] Test deployment via GitLab pipeline
- [ ] Verify aplikasi running di Railway
- [ ] Setup custom domain (optional)

---

## 🔄 Workflow Summary

```
GitLab Push → GitLab CI/CD → Railway CLI → Railway Deploy → Live! 🎉
```

**Setiap push ke `main` branch:**
1. GitLab CI/CD trigger
2. Run tests (optional)
3. Railway CLI deploy services
4. Railway build Docker images
5. Railway deploy containers
6. Aplikasi live!
