# 🎓 AI Learning Platform - Mini MVP

An AI-powered learning platform that enables users to create personalized lessons, track their learning history, and allows administrators to manage all users.

## 📋 Table of Contents

* [Overview](#-overview)
* [System Requirements](#-system-requirements)
* [Local Installation](#-local-installation)
* [Project Architecture](#-project-architecture)
* [API Endpoints](#-api-endpoints)
* [Docker & Deployment](#-docker--deployment)
* [Environment Variables](#-environment-variables)
* [Future Features](#-future-features)

---

## 🎯 Overview

### Technologies Used

| Layer                | Technology                           |
| -------------------- | ------------------------------------ |
| **Frontend**         | React 18 + Vite + Tailwind CSS       |
| **Backend**          | Express.js + TypeScript + Prisma ORM |
| **Database**         | PostgreSQL 15                        |
| **AI Engine**        | OpenAI API (GPT-4) / Mock Mode       |
| **Containerization** | Docker + Docker Compose              |

### Main Features

✅ **User Registration** – Create an account with name and phone number
✅ **Category Selection** – Science, Software Development, and more
✅ **Lesson Generation** – AI-powered personalized prompts
✅ **Learning History** – Save and view all lessons
✅ **Admin Dashboard** – View all users and learning history
✅ **Input Validation** – Full validation using Zod
✅ **Admin Protection** – Basic authentication for the Admin panel

---

## 💻 System Requirements

* **Node.js** 18.x or higher
* **Docker** and **Docker Compose** (for containerized deployment)
* **PostgreSQL** 15+ (if not using Docker)
* **npm** or **pnpm**

---

## 🚀 Local Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-learning-platform
```

### 2. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

### 3. Run the Backend

```bash
npm install

npx prisma migrate dev

npm run dev
```

### 4. Run the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 5. Open the Application

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🏗️ Project Architecture

```text
ai-learning-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── learning.controller.ts
│   │   ├── routes/
│   │   │   └── learning.routes.ts
│   │   ├── services/
│   │   │   ├── ai.service.ts
│   │   │   └── openai.service.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── validateRequest.ts
│   │   │   └── adminAuth.ts
│   │   ├── validators/
│   │   │   └── schemas.ts
│   │   ├── config/
│   │   │   └── db.ts
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

### Architecture Layers

| Layer           | Description                                            |
| --------------- | ------------------------------------------------------ |
| **Routes**      | Define API endpoints and route requests to controllers |
| **Controllers** | Handle HTTP requests, extract data, and call services  |
| **Services**    | Contain business logic (such as OpenAI integrations)   |
| **Validators**  | Zod schemas for input validation                       |
| **Middleware**  | Error handling, logging, and authentication            |
| **Config**      | Database and environment configuration                 |

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| `GET`  | `/api/health`         | Server health check     |
| `POST` | `/api/users/register` | Register a new user     |
| `GET`  | `/api/categories`     | Retrieve all categories |

### Protected Endpoints

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| `POST` | `/api/learning/prompt`       | Generate a new lesson |
| `GET`  | `/api/users/:userId/history` | User learning history |

### Admin Endpoints

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| `GET`  | `/api/admin/dashboard` | Admin dashboard (requires Admin Key) |

---

## 🐳 Docker & Deployment

### Run with Docker Compose

```bash
docker-compose up --build

docker-compose up -d
```

### Stop the System

```bash
docker-compose down

# Remove volumes as well
docker-compose down -v
```

### View Logs

```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Access Containers

```bash
docker exec -it ai_platform_backend sh
docker exec -it learning_platform_db psql -U myuser -d learning_db
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000

# Database
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/learning_db?schema=public

# OpenAI Configuration
USE_MOCK_AI=true
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4

# Admin Authentication
ADMIN_API_KEY=your-secret-admin-key
```

### Enable Real OpenAI Integration

1. Create an account on OpenAI Platform
2. Generate a new API Key
3. Update your `.env`:

```env
USE_MOCK_AI=false
OPENAI_API_KEY=sk-...
```

4. Restart the server

---

## 🗄️ Database Models

### User

| Field       | Type     | Description           |
| ----------- | -------- | --------------------- |
| `id`        | Int      | Unique identifier     |
| `name`      | String   | Full name             |
| `phone`     | String   | Phone number (unique) |
| `createdAt` | DateTime | Creation date         |

### Category

| Field  | Type   | Description       |
| ------ | ------ | ----------------- |
| `id`   | Int    | Unique identifier |
| `name` | String | Category name     |

### SubCategory

| Field        | Type   | Description           |
| ------------ | ------ | --------------------- |
| `id`         | Int    | Unique identifier     |
| `name`       | String | Subcategory name      |
| `categoryId` | Int    | Category relationship |

### PromptLog

| Field           | Type     | Description              |
| --------------- | -------- | ------------------------ |
| `id`            | Int      | Unique identifier        |
| `userId`        | Int      | User relationship        |
| `categoryId`    | Int      | Category relationship    |
| `subCategoryId` | Int      | Subcategory relationship |
| `prompt`        | String   | User prompt              |
| `response`      | String   | AI response              |
| `createdAt`     | DateTime | Creation date            |

---

## 🔐 Security

### Input Validation

* All inputs are validated using **Zod schemas**
* Data sanitization before database insertion
* SQL Injection prevention through Prisma ORM

### Admin Protection

* Requires `Admin-Api-Key` header for dashboard access
* Configured through the `ADMIN_API_KEY` environment variable

### CORS

* Configured to allow access only from `http://localhost:5173` during development
* Should be updated to the production domain before deployment

---

## 🧪 Testing

```bash
npm test

npm run test:coverage
```

---

## 📈 Future Features

* [ ] JWT Authentication
* [ ] User Profile & Settings
* [ ] Lesson Rating & Bookmarking
* [ ] Export Learning History to PDF
* [ ] Notifications System
* [ ] Integration with Additional AI Models (Claude, Gemini)
* [ ] End-to-End Testing with Playwright

---

## 📄 License

This project is a Mini MVP created for demonstration and learning purposes.

---

## 👤 Author

Created as part of a Full-Stack Development course assessment project.

---

**⭐ If you found this project useful, give it a star!**
