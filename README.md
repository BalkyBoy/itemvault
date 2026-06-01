# Dufil

A full-stack web application with user authentication, dashboard, and item management built with Express, Next.js, and PostgreSQL.

## Project Structure

```
Dufil/
├── backend/          # Express + TypeScript API
│   ├── src/
│   │   ├── modules/          # Feature modules (auth, items, dashboard)
│   │   ├── models/           # Database models
│   │   ├── repositories/     # Data access layer
│   │   ├── database/         # Database setup and migrations
│   │   ├── config/           # Configuration
│   │   └── shared/           # Shared utilities, middleware, errors
│   ├── Dockerfile
│   ├── knexfile.ts
│   └── package.json
├── frontend/         # Next.js application
│   ├── app/
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   └── dashboard/        # Protected dashboard
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   ├── context/              # Context providers (Auth, Items)
│   ├── lib/                  # Utilities and API client
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development (hot reload)
├── .env.example
└── README.md
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2.20+
- Node.js 22+ (for local development without Docker)

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository>
cd Dufil
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and set:
- `POSTGRES_PASSWORD` — PostgreSQL password (any secure value)
- `JWT_SECRET` — JWT signing secret (use a strong random string)
- `JWT_REFRESH_SECRET` — JWT refresh token secret
- `NEXT_PUBLIC_API_URL` — Backend API URL (http://localhost:4000/api/v1 for dev)

---

## Development Setup (with Docker)

### Start All Services with Hot Reload

```bash
docker compose -f docker-compose.dev.yml up
```

This starts:
- **Frontend** (Next.js): http://localhost:3000
- **Backend** (Express): http://localhost:4000
- **Database** (PostgreSQL): localhost:5432

All services auto-reload on code changes.

### Useful Dev Commands

```bash
# Start in background
docker compose -f docker-compose.dev.yml up -d

# View logs for all services
docker compose -f docker-compose.dev.yml logs -f

# View logs for specific service
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend

# Run database migrations
docker compose -f docker-compose.dev.yml exec backend npm run db:migrate

# Run database seeds
docker compose -f docker-compose.dev.yml exec backend npm run db:seed

# Stop all services
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes (wipes database)
docker compose -f docker-compose.dev.yml down -v
```

---

## Local Development Setup (without Docker)

### Backend Setup

```bash
cd backend
npm install
cp .env .env.local

# Set up local database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Backend runs on http://localhost:4000

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local

# Start development server
npm run dev
```

Frontend runs on http://localhost:3000

---

## Production Deployment

### Build and Run

```bash
docker compose up --build -d
```

Builds optimized multi-stage images and starts services in background.

### Stop Services

```bash
docker compose down
```

### Database Management

```bash
# View logs
docker compose logs -f

# Run migrations
docker compose exec backend npm run db:migrate

# Stop and remove volumes (wipes data)
docker compose down -v
```

---

## Service URLs & Ports

| Service  | Development              | Production              | Internal |
|----------|--------------------------|-------------------------|----------|
| Frontend | http://localhost:3000    | http://localhost:3000   | N/A      |
| Backend  | http://localhost:4000    | Not exposed             | :4000    |
| Database | localhost:5432           | Not exposed             | :5432    |

---

## Features

### Authentication
- User registration with email and password
- JWT-based authentication (access & refresh tokens)
- Protected routes and API endpoints
- Login and registration modal with validation
- Persistent authentication context

### Dashboard
- Authenticated user dashboard
- User profile management
- Role-based access control

### Items Management
- Create, read, update, delete items
- Categorize items
- Filter items by category and status
- Dashboard analytics with category insights
- Responsive item cards with status badges

### Category Management
- Predefined categories (seeded on first run)
- Filter and select categories
- Category-based analytics

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Gradient shader effects (GodRays)
- Dark mode-friendly color scheme
- Loading states and error handling

---

## Database Schema

### Tables
- **users** — User accounts with authentication
- **items** — Items/products with title, description, category, status
- **categories** — Item categories

### Seeded Data
- Categories: Electronics, Fashion, Home, Sports, Books, Other
- Sample items per category
- Test user account

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` — Create new account
- `POST /api/v1/auth/login` — Login with email/password
- `POST /api/v1/auth/refresh` — Refresh access token

### Items
- `GET /api/v1/items` — Get all items
- `POST /api/v1/items` — Create item
- `GET /api/v1/items/:id` — Get item details
- `PUT /api/v1/items/:id` — Update item
- `DELETE /api/v1/items/:id` — Delete item

### Dashboard
- `GET /api/v1/dashboard` — Get dashboard analytics

---

## Build Images Manually

### Backend Image

```bash
cd backend
docker build -t dufil-backend .
docker run -p 4000:4000 --env-file .env dufil-backend
```

### Frontend Image

```bash
cd frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 \
  -t dufil-frontend .
docker run -p 3000:3000 dufil-frontend
```

---

## Environment Variables Reference

| Variable                | Required | Description                              |
|-------------------------|----------|------------------------------------------|
| `POSTGRES_USER`         | Yes      | PostgreSQL username                      |
| `POSTGRES_PASSWORD`     | Yes      | PostgreSQL password                      |
| `POSTGRES_DB`           | Yes      | PostgreSQL database name                 |
| `DATABASE_URL`          | Yes      | Full Postgres connection string          |
| `JWT_SECRET`            | Yes      | Access token signing secret (64+ chars)  |
| `JWT_REFRESH_SECRET`    | Yes      | Refresh token signing secret (64+ chars) |
| `JWT_EXPIRES_IN`        | No       | Access token TTL (default: `7d`)         |
| `JWT_REFRESH_EXPIRES_IN`| No       | Refresh token TTL (default: `30d`)       |
| `NEXT_PUBLIC_API_URL`   | Yes      | Public backend URL used by the browser   |
| `FRONTEND_PORT`         | No       | Host port for frontend (default: `3000`) |
| `BACKEND_PORT`          | No       | Host port for backend (default: `4000`)  |

---

## Troubleshooting

### Backend can't connect to Postgres

Ensure `DATABASE_URL` uses the service name `postgres` as the host (not `localhost`):

```
DATABASE_URL=postgresql://postgres:changeme@postgres:5432/items
```

### Frontend shows API errors in production

`NEXT_PUBLIC_API_URL` is baked into the frontend bundle at build time. If you change it, rebuild the frontend image:

```bash
docker compose up --build frontend
```

### Port already in use

Change the host port in `.env`:

```
FRONTEND_PORT=3001
BACKEND_PORT=4001
```

### Wipe and restart everything

```bash
docker compose down -v --remove-orphans
docker compose up --build -d
```

### View running containers

```bash
docker compose ps
```

### Open a shell inside a container

```bash
docker compose exec backend sh
docker compose exec frontend sh
docker compose exec postgres psql -U postgres -d items
```

---

## Tech Stack

### Backend
- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Objection.js (with Knex migrations)
- **Authentication:** JWT (access + refresh tokens)
- **Security:** Bcrypt password hashing
- **Validation:** Custom middleware validators

### Frontend
- **Framework:** Next.js 14+
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** React Context API
- **HTTP Client:** Fetch API (via custom `lib/api.ts`)
- **Package Manager:** pnpm

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 15+
- **Reverse Proxy:** Not included (use nginx/caddy in production)

---

## Features Implemented

✅ **User Authentication**
- Register new accounts with email validation
- Login with JWT tokens
- Token refresh mechanism
- Protected dashboard routes
- Separate login page linked from registration modal

✅ **Item Management**
- Full CRUD operations
- Category-based filtering
- Status tracking (active/inactive)
- Responsive item cards with status badges

✅ **Dashboard**
- User-specific dashboard with analytics
- Category analytics and insights
- Item statistics
- Protected access control

✅ **Modern UI**
- Responsive design (mobile-first)
- Smooth page transitions with Framer Motion
- Gradient shader effects (GodRays)
- Dark theme with light accents
- Loading and error states
- SVG avatars for testimonials

✅ **Developer Experience**
- Full TypeScript for type safety
- Hot reload in development
- Docker for consistent environments
- Database migrations and seeds
- Structured code organization (MVC pattern)
- Middleware-based architecture

---

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review Docker Compose logs: `docker compose logs -f`
- Open an issue on the repository

---

## License

MIT License — see LICENSE file for details
