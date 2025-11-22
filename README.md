# Ragam Bahasa Nusantara (RANA)

A full-stack digital platform for preserving and revitalizing Indonesia's local languages through interactive learning and community collaboration.

## 🌟 Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 🎙️ **Audio Recording** - Record and upload local dialects
- 📚 **Interactive Dictionary** - Learn vocabulary interactively
- 🗺️ **Language Map** - Explore an interactive map of Indonesian languages
- 👥 **Community Driven** - Contributions and validation by community members
- 🎯 **Gamification** - Missions and achievements to encourage participation
- 👨‍⚖️ **Validator Dashboard** - Role-based access for content validation

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.4.19
- **Styling:** TailwindCSS 3.4.17
- **UI Components:** Radix UI (Shadcn/ui)
- **Routing:** React Router DOM 6.30.1
- **State Management:** React Context + TanStack Query
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI 0.104.1
- **Language:** Python 3.11
- **ORM:** SQLAlchemy 2.0.23
- **Authentication:** JWT (python-jose)
- **Password Hashing:** Bcrypt (passlib)
- **Database Driver:** PyMySQL

### Database
- **RDBMS:** MySQL 8.0

### DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (for frontend)
- **ASGI Server:** Uvicorn (for backend)

## 📋 Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (comes with Docker Desktop)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/username/ragam-bahasa-nusantara.git
cd ragam-bahasa-nusantara
```

### 2. Environment Configuration

The project comes with a default `.env` file. For production, you should change the secrets:

```bash
# Optional: Edit .env file to customize settings
nano .env
```

**Important:** Change these values in production:
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `SECRET_KEY` (make it long and random)

## 🚀 Deployment

### Deploy to Railway (Recommended for Production)

This project supports deployment to Railway with CI/CD integration from GitLab or GitHub.

#### Option 1: GitLab CI/CD → Railway (Recommended) ✅

Automatically deploy from GitLab using CI/CD pipeline:

1. **Quick Start:**
   ```bash
   # Run the interactive deployment script
   ./deploy-railway.sh
   ```

2. **Manual Setup:**
   - See detailed instructions in [`RAILWAY_DEPLOYMENT.md`](RAILWAY_DEPLOYMENT.md)
   - Quick reference: [`GITLAB_RAILWAY_CHEATSHEET.md`](GITLAB_RAILWAY_CHEATSHEET.md)

3. **Setup GitLab CI/CD Variables:**
   - `RAILWAY_TOKEN` - Get from `railway login --browserless`
   - `RAILWAY_PROJECT_ID` - From Railway dashboard
   - `RAILWAY_APP_URL` - Your app URL

4. **Deploy:**
   ```bash
   git push origin main  # Auto-deploys via GitLab CI/CD! 🎉
   ```

#### Option 2: GitHub Mirror → Railway

Use Railway's native GitHub integration:

1. Mirror your GitLab repo to GitHub (automated via GitLab CI/CD)
2. Connect Railway to GitHub repository
3. Railway auto-deploys on every push

See [`RAILWAY_DEPLOYMENT.md`](RAILWAY_DEPLOYMENT.md) for complete setup instructions.

#### Railway Configuration Files

- `.gitlab-ci.yml` - GitLab CI/CD pipeline
- `railway.json` - Railway deployment configuration
- `.env.railway` - Environment variables template
- `deploy-railway.sh` - Interactive deployment script

### 3. Start the Application

```bash
# Make start script executable (first time only)
chmod +x start.sh

# Start all services
./start.sh
```

Or manually with Docker Compose:

```bash
docker-compose up --build
```

### 4. Access the Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/api/docs
- **MySQL:** localhost:3306

### 5. Test the Application

**Default Test Accounts:**
- **Contributor:** 
  - Email: `contributor@example.com`
  - Password: `password123`
- **Validator:**
  - Email: `validator@example.com`
  - Password: `password123`

Or create a new account via the registration page: http://localhost/auth

## 📁 Project Structure

```
ragam-bahasa-nusantara/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # FastAPI application entry
│   │   ├── config.py          # Configuration settings
│   │   ├── database.py        # Database connection
│   │   ├── dependencies.py    # Shared dependencies
│   │   ├── models/            # SQLAlchemy models
│   │   │   └── user.py
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── user.py
│   │   │   └── auth.py
│   │   ├── routers/           # API endpoints
│   │   │   └── auth.py
│   │   ├── services/          # Business logic
│   │   │   └── auth_service.py
│   │   └── utils/             # Utilities
│   │       ├── security.py
│   │       └── exceptions.py
│   ├── init.sql               # Database initialization
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
│
├── src/                        # React Frontend
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── services/              # API services
│   │   ├── api.ts            # Axios instance
│   │   └── auth.service.ts   # Auth API calls
│   ├── context/               # React context
│   ├── hooks/                 # Custom hooks
│   └── lib/                   # Utilities
│
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Frontend Dockerfile
├── nginx.conf                 # Nginx configuration
├── .env                       # Environment variables
└── start.sh                   # Startup script
```

## 🔌 API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "contributor"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "contributor",
  "is_active": true,
  "created_at": "2025-11-22T02:25:08.123456"
}
```

#### POST `/api/auth/login`
Login and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### GET `/api/auth/me`
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "contributor",
  "is_active": true,
  "created_at": "2025-11-22T02:25:08.123456"
}
```

#### POST `/api/auth/logout`
Logout (client-side token clearing).

## 🔐 Authentication Flow

1. **Register:** User creates account via `/api/auth/register`
2. **Login:** User logs in via `/api/auth/login` and receives JWT token
3. **Token Storage:** Frontend stores token in `localStorage`
4. **Authenticated Requests:** Token is automatically added to all API requests via axios interceptor
5. **Token Validation:** Backend validates token on protected endpoints
6. **Auto-Logout:** On 401 response, user is automatically logged out

## 🐳 Docker Services

### MySQL Service
- **Image:** mysql:8.0
- **Port:** 3306
- **Database:** ragam_bahasa_db
- **User:** rana_user
- **Volume:** Persistent data storage

### Backend Service
- **Build:** ./backend
- **Port:** 8000
- **Environment:** Python 3.11
- **Features:**
  - Hot reload for development
  - Auto database initialization
  - Health check endpoint

### Frontend Service
- **Build:** ./ (root)
- **Port:** 80
- **Features:**
  - Nginx static file serving
  - API proxy to backend
  - React Router support

## 🛠 Development

### Frontend Development

```bash
# Install dependencies
npm install

# Run development server (without Docker)
npm run dev

# Build for production
npm run build
```

### Backend Development

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server (without Docker)
uvicorn app.main:app --reload
```

### Database Access

```bash
# Access MySQL shell
docker-compose exec mysql mysql -u rana_user -p
# Password: secure_password (or from .env)

# View users table
USE ragam_bahasa_db;
SELECT * FROM users;
```

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('contributor', 'validator') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

## 🧪 Testing

### Manual API Testing with curl

```bash
# Test registration
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User",
    "role": "contributor"
  }'

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Test protected endpoint (replace TOKEN with actual token)
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Frontend Testing

1. Open browser to http://localhost/auth
2. Try registration with different roles
3. Try login with created account
4. Verify redirect to home page
5. Check profile page shows correct user data
6. Test logout functionality

## 🚨 Troubleshooting

### Port Already in Use

If ports 80, 3306, or 8000 are already in use:

```bash
# Stop other services or change ports in docker-compose.yml
docker-compose down
```

### Database Connection Issues

```bash
# Check MySQL is healthy
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Frontend Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild Docker images
docker-compose up --build --force-recreate
```

### Backend Issues

```bash
# View backend logs
docker-compose logs backend

# Access backend container
docker-compose exec backend bash

# Check Python version
docker-compose exec backend python --version
```

## 🔒 Security Notes

### Production Checklist

- [ ] Change `SECRET_KEY` to a long random string (256+ bits)
- [ ] Change all database passwords
- [ ] Set `DEBUG=False` in backend
- [ ] Use HTTPS (configure reverse proxy)
- [ ] Set proper CORS origins (remove localhost)
- [ ] Enable rate limiting
- [ ] Add WAF (Web Application Firewall)
- [ ] Regular security updates
- [ ] Implement backup strategy
- [ ] Add monitoring and logging

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | rootpassword |
| `MYSQL_DATABASE` | Database name | ragam_bahasa_db |
| `MYSQL_USER` | MySQL user | rana_user |
| `MYSQL_PASSWORD` | MySQL password | secure_password |
| `DATABASE_URL` | SQLAlchemy connection string | mysql+pymysql://... |
| `SECRET_KEY` | JWT secret key | (change in production) |
| `ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration | 30 |
| `VITE_API_URL` | Frontend API URL | http://localhost:8000 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Indonesian Ministry of Education and Culture
- Local language communities
- Open source contributors

---

**Made with ❤️ for preserving Indonesian cultural heritage**
<!-- Auto-mirror test: Sat Nov 22 17:44:38 WIB 2025 -->

<!-- Auto-mirror test: Sat Nov 22 17:46:15 WIB 2025 -->
