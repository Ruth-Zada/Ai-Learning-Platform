
# 🎓 AI Learning Platform - Mini MVP

פלטפורמת למידה חכמה מבוססת בינה מלאכותית (AI) המאפשרת למשתמשים ליצור שיעורים מותאמים אישית, לעקוב אחר היסטוריית הלמידה שלהם, ולמנהלי מערכת לנהל את כלל המשתמשים.

## 📋 תוכן עניינים

- [סקירה כללית](#-סקירה-כללית)
- [דרישות מערכת](#-דרישות-מערכת)
- [התקנה מקומית](#-התקנה-מקומית)
- [ארכיטקטורת הפרויקט](#-ארכיטקטורת-הפרויקט)
- [API Endpoints](#-api-endpoints)
- [דוקר והתקנה](#-דוקר-והתקנה)
- [משתני סביבה](#-משתני-סביבה)
- [פיצ'רים עתידיים](#-פיצרים-עתידיים)

---

## 🎯 סקירה כללית

### טכנולוגיות בשימוש

| שכבה | טכנולוגיה |
|------|----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Express.js + TypeScript + Prisma ORM |
| **Database** | PostgreSQL 15 |
| **AI Engine** | OpenAI API (GPT-4) / Mock Mode |
| **Container** | Docker + Docker Compose |

### פיצ'רים עיקריים

✅ **רישום משתמשים** - יצירת חשבון עם שם ומספר טלפון  
✅ **בחירת קטגוריה** - מדעים, פיתוח תוכנה ועוד  
✅ **יצירת שיעורים** - פרומפטים מותאמים אישית ל-AI  
✅ **היסטוריית למידה** - שמירה ותצוגת כל השיעורים  
✅ **דשבורד מנהל** - צפייה בכל המשתמשים וההיסטוריה  
✅ **אימות קלטים** - ולידציה מלאה עם Zod  
✅ **הגנה על מנהל** - אימות בסיסי לפאנל Admin  

---

## 💻 דרישות מערכת

- **Node.js** 18.x ומעלה
- **Docker** ו-**Docker Compose** (להרצה בקונטיינרים)
- **PostgreSQL** 15+ (אם לא משתמשים ב-Docker)
- **npm** או **pnpm**

---

## 🚀 התקנה מקומית

### 1. שכפול הפרויקט

```bash
git clone <repository-url>
cd ai-learning-platform
```

### 2. הגדרת משתני סביבה

```bash

cd backend
cp .env.example .env


```

### 3. הרצת ה-backend

```bash

npm install

npx prisma migrate dev

npm run dev
```

### 4. הרצת ה-frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 5. פתיחת האפליקציה

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🏗️ ארכיטקטורת הפרויקט

```
ai-learning-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/      # בקרים - לוגיקת טיפול בבקשות
│   │   │   └── learning.controller.ts
│   │   ├── routes/           # נתיבים - מיפוי URL לבקרים
│   │   │   └── learning.routes.ts
│   │   ├── services/         # שירותים - לוגיקה עסקית
│   │   │   ├── ai.service.ts
│   │   │   └── openai.service.ts
│   │   ├── middleware/        # תוכנת ביניים
│   │   │   ├── errorHandler.ts
│   │   │   ├── validateRequest.ts
│   │   │   └── adminAuth.ts
│   │   ├── validators/        # סכמות Zod לוולידציה
│   │   │   └── schemas.ts
│   │   ├── config/           # הגדרות
│   │   │   └── db.ts
│   │   └── app.ts            # נקודת כניסה ראשית
│   ├── prisma/
│   │   └── schema.prisma     # הגדרות מודלים
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # קומפוננטה ראשית
│   │   └── main.jsx          # נקודת כניסה
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

### שכבות הארכיטקטורה

| שכבה | תיאור |
|------|-------|
| **Routes** | מגדירים את הנתיבים (endpoints) ומפנים לבקרים המתאימים |
| **Controllers** | מטפלים בבקשות HTTP, מחלצים נתונים, וקוראים לשירותים |
| **Services** | מכילים את הלוגיקה העסקית (כמו קריאה ל-OpenAI) |
| **Validators** | סכמות Zod לאימות תקינות הקלטים |
| **Middleware** | תוכניות ביניים לטיפול בשגיאות, לוגים, ואימות |
| **Config** | הגדרות חיבור לבסיס נתונים וסביבה |

---

## 📡 API Endpoints

### נקודות קצה ציבוריות

| Method | Endpoint | תיאור |
|--------|----------|-------|
| `GET` | `/api/health` | בדיקת תקינות השרת |
| `POST` | `/api/users/register` | רישום משתמש חדש |
| `GET` | `/api/categories` | שליפת כל הקטגוריות |

### נקודות קצה מוגנות

| Method | Endpoint | תיאור |
|--------|----------|-------|
| `POST` | `/api/learning/prompt` | יצירת שיעור חדש |
| `GET` | `/api/users/:userId/history` | היסטוריית למידה של משתמש |

### נקודות קצה למנהל

| Method | Endpoint | תיאור |
|--------|----------|-------|
| `GET` | `/api/admin/dashboard` | דשבורד מנהל (דורש Admin Key) |

---

## 🐳 דוקר והתקנה

### הרצה עם Docker Compose

```bash
docker-compose up --build

docker-compose up -d
```

### עצירת המערכת

```bash
docker-compose down

# עם מחיקת נתונים
docker-compose down -v
```

### צפייה בלוגים

```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### גישה לקונטיינר

```bash
docker exec -it ai_platform_backend sh
docker exec -it learning_platform_db psql -U myuser -d learning_db
```

---

## 🔧 משתני סביבה

### Backend (.env)

```env
# Server
PORT=5000

# Database
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/learning_db?schema=public

# OpenAI Configuration
USE_MOCK_AI=true              # true = Mock Mode, false = Real OpenAI
OPENAI_API_KEY=sk-your-key    # נדרש רק אם USE_MOCK_AI=false
OPENAI_MODEL=gpt-4

# Admin Authentication
ADMIN_API_KEY=your-secret-admin-key
```

### הפעלת OpenAI אמיתית

1. צור חשבון ב-[OpenAI Platform](https://platform.openai.com/)
2. צור API Key חדש
3. עדכן את `.env`:
   ```
   USE_MOCK_AI=false
   OPENAI_API_KEY=sk-...
   ```
4. הפעל מחדש את השרת

---

## 🗄️ מודלים בבסיס הנתונים

### User (משתמש)

| שדה | סוג | תיאור |
|-----|-----|-------|
| `id` | Int | מזהה ייחודי |
| `name` | String | שם מלא |
| `phone` | String | מספר טלפון (ייחודי) |
| `createdAt` | DateTime | תאריך יצירה |

### Category (קטגוריה)

| שדה | סוג | תיאור |
|-----|-----|-------|
| `id` | Int | מזהה ייחודי |
| `name` | String | שם הקטגוריה |

### SubCategory (תת-קטגוריה)

| שדה | סוג | תיאור |
|-----|-----|-------|
| `id` | Int | מזהה ייחודי |
| `name` | String | שם תת-הקטגוריה |
| `categoryId` | Int | קשר לקטגוריה |

### PromptLog (יומן פרומפטים)

| שדה | סוג | תיאור |
|-----|-----|-------|
| `id` | Int | מזהה ייחודי |
| `userId` | Int | קשר למשתמש |
| `categoryId` | Int | קשר לקטגוריה |
| `subCategoryId` | Int | קשר לתת-קטגוריה |
| `prompt` | String | השאילתה של המשתמש |
| `response` | String | התשובה מה-AI |
| `createdAt` | DateTime | תאריך יצירה |

---

## 🔐 אבטחה

### אימות קלטים
- כל הקלטים מאומתים עם **Zod schemas**
- סניטיזציה של נתונים לפני כניסה לבסיס נתונים
- מניעת SQL Injection דרך Prisma ORM

### הגנה על פאנל Admin
- נדרש `Admin-Api-Key` header לגישה לדשבורד
- הגדרה במשתנה סביבה `ADMIN_API_KEY`

### CORS
- מוגדר לגישה מ-`http://localhost:5173` בלבד (פיתוח)
- יש לעדכן לדומיין הייצור בהרצה אמיתית

---

## 🧪 בדיקות

```bash

npm test


npm run test:coverage
```

---

## 📈 פיצ'רים עתידיים

- [ ] מערכת התחברות עם JWT
- [ ] פרופיל משתמש עם הגדרות
- [ ] סימוניות ודירוג שיעורים
- [ ] ייצוא היסטוריה ל-PDF
- [ ] מערכת הודעות והתראות
- [ ] אינטגרציה עם מודלים נוספים (Claude, Gemini)
- [ ] בדיקות E2E עם Playwright

---

## 📄 רישיון

פרויקט זה הוא Mini MVP לצורך הדגמה ולמידה.

---

## 👤 מחבר

נוצר כחלק מפרויקט הערכה לקורס Full-Stack Development

---

**⭐ אם הפרויקט היה שימושי, תן כוכב!**
=======
# Ai-Learning-Platform
