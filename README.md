# LinkPulse — URL Shortener + Click Intelligence Platform

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django 5.x](https://img.shields.io/badge/Django-5.x-green.svg)](https://www.djangoproject.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

**LinkPulse** is a full-stack, production-ready SaaS platform for URL shortening, real-time click tracking, traffic analytics, and campaign intelligence.

---

## 📁 Repository Structure

The project is cleanly divided into standalone `backend` and `frontend` applications:

```text
URL shortner/
├── backend/                  # Django REST Framework Backend
│   ├── manage.py
│   ├── apps/                 # Modular Django apps (accounts, workspaces, links, tracking, analytics, campaigns)
│   ├── config/               # Settings, URLs, WSGI, ASGI, Celery
│   ├── requirements/         # Dependencies (base.txt, development.txt, production.txt)
│   ├── scripts/              # Seed data scripts
│   ├── tests/                # Pytest integration & unit test suite
│   ├── docs/                 # API Contract documentation (API_CONTRACT.md)
│   └── Dockerfile
│
├── frontend/                 # React + Vite Frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/                  # React application (components, features, store, api, styles)
│   ├── vercel.json           # Vercel SPA deployment config
│   └── Dockerfile
│
├── docker-compose.yml        # Full-stack Docker Compose orchestrator
├── Makefile                  # Root Makefile shortcuts
└── README.md
```

---

## 🚀 Quick Start (Local Running)

### 1. Run Backend (Terminal 1)

```bash
cd backend

# Create virtual environment & install dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements/development.txt

# Copy environment variables
cp .env.example .env

# Run database migrations & seed demo data
python manage.py migrate
python manage.py seed_data

# Start Django backend server
python manage.py runserver 0.0.0.0:8000
```
Backend API will be available at: `http://127.0.0.1:8000/`  
Swagger API Docs: `http://127.0.0.1:8000/api/docs/`

---

### 2. Run Frontend (Terminal 2)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite React development server
npm run dev
```
Frontend UI will be available at: `http://localhost:5173/`

---

## 🐳 Docker Compose (Full-Stack Containerization)

To run the complete system (PostgreSQL, Redis, Django Backend, Celery Worker, React Frontend) in containers:

```bash
docker compose up --build
```

---

## 🧪 Testing & Verification

### Backend Tests
```bash
cd backend
source .venv/bin/activate
DATABASE_URL=sqlite:///db.sqlite3 pytest
```

### Frontend Tests
```bash
cd frontend
npx vitest run
```

---

## 📄 License
This project is licensed under the MIT License.
