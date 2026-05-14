# Zenbile Logistics & Delivery Platform

Zenbile is a scalable, modern on-demand delivery platform built specifically for Ethiopia (Addis Ababa), inspired by BeU Delivery, Sendy, Uber Connect, and Lalamove.

## 🌟 Features
- **Customer Portal**: Request parcel/package deliveries, real-time tracking, Ethiopian payments.
- **Rider Portal**: Accept/decline jobs, live navigation, earnings dashboard.
- **Admin Dashboard**: Manage users, live delivery map, analytics, payment monitoring.
- **Real-time Tracking**: Powered by Socket.io and Google Maps.

## ⚙️ Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, Framer Motion, React Query
- **Backend**: Node.js, Express, TypeScript, Socket.io
- **Database**: MongoDB (or PostgreSQL)
- **Deployment**: Docker, Docker Compose, Vercel/Render, CI/CD with GitHub Actions

## 🚀 Setup & Installation

### Prerequisites
- Node.js v20+
- Docker and Docker Compose
- MongoDB (if running locally without Docker)

### 1. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zenbile
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
TELEBIRR_APP_ID=your_telebirr_app_id
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 2. Run with Docker Compose (Recommended)
```bash
docker-compose up --build
```
This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend Next.js app on port 3000

### 3. Run Manually
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Folder Structure
- `/frontend`: Next.js web application
- `/backend`: Node.js/Express API server
- `/.github/workflows`: CI/CD pipelines
- `docker-compose.yml`: Local Docker orchestration

## 🔐 Security Features
- JWT Authentication
- Role-Based Access Control (RBAC)
- HTTPS-only in production
- Rate Limiting & Input Validation
