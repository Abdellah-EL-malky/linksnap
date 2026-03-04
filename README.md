# LinkSnap — URL Shortener & Analytics

[![Live Demo](https://img.shields.io/badge/Live%20Demo-linksnap--pi.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://linksnap-pi.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://linksnap-api-6exx.onrender.com)

A full-stack URL shortener with real-time click analytics, built with Spring Boot and React.

---

## Features

- Shorten any URL with a random or custom code
- Redirect tracking — every click is recorded with browser, OS and device info
- Analytics dashboard with charts — clicks over time, top countries, browsers, devices
- Per-link analytics page
- JWT authentication — each user manages their own links
- QR-friendly short URLs

## Tech Stack

**Backend**
- Java 17, Spring Boot 3.2, Spring Security, JWT
- Spring Data JPA, Hibernate
- PostgreSQL (Neon)
- Deployed on Render (Docker)

**Frontend**
- React 18, Vite, Tailwind CSS
- Recharts — LineChart, BarChart, PieChart
- Axios, React Router v6, React Hot Toast
- Deployed on Vercel

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven

### Backend

```bash
cd backend
mvn wrapper:wrapper
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.
H2 console available at `http://localhost:8080/h2-console`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will start on `http://localhost:5173`.

### Environment Variables

**Backend** (`application-prod.properties`):
```
DATABASE_URL=jdbc:postgresql://...
JWT_SECRET=your-secret
BASE_URL=https://your-render-url.onrender.com
```

**Frontend** (`.env`):
```
VITE_API_URL=https://your-render-url.onrender.com
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/links` | Yes | Get my links |
| POST | `/api/links` | Yes | Create short link |
| DELETE | `/api/links/:id` | Yes | Delete link |
| GET | `/r/:code` | No | Redirect + track click |
| GET | `/api/analytics/dashboard` | Yes | Global analytics |
| GET | `/api/analytics/links/:id` | Yes | Per-link analytics |

## Deployment

**Database** — [Neon](https://neon.tech) (PostgreSQL free tier)

**Backend** — [Render](https://render.com) with Docker runtime

Environment variables to set on Render:
```
DATABASE_URL=jdbc:postgresql://...neon.tech/neondb?user=...&password=...&sslmode=require
JWT_SECRET=your-secret-key
SPRING_PROFILES_ACTIVE=prod
BASE_URL=https://your-app.onrender.com
```

**Frontend** — [Vercel](https://vercel.com)

- Root directory: `frontend`
- Framework preset: Vite
- Environment variable: `VITE_API_URL=https://your-app.onrender.com`

## Project Structure

```
linksnap/
├── Dockerfile
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/linksnap/
│       ├── entity/          # User, ShortLink, Click
│       ├── repository/      # JPA repositories + JPQL analytics queries
│       ├── service/         # AuthService, LinkService, AnalyticsService
│       ├── controller/      # AuthController, LinkController, AnalyticsController
│       ├── security/        # JWT filter, JwtUtil
│       └── config/          # SecurityConfig, GlobalExceptionHandler
└── frontend/
    └── src/
        ├── pages/           # HomePage, LinksPage, DashboardPage, LoginPage
        ├── components/      # Navbar, Layout
        ├── services/        # Axios instance
        └── store/           # AuthContext
```

## Author

**Abdellah El Malky** — Full-Stack Developer  
[GitHub](https://github.com/Abdellah-EL-malky)
