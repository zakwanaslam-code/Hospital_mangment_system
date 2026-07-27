# MediCore — Hospital EMR Backend (Node + Express + MongoDB)

## Step 1 — Setup Complete ✅

Ban chuka hai:
- Express server with security middleware (`helmet`, `cors`, rate limiting, `compression`)
- MongoDB connection (`config/db.js`) via Mongoose
- Global error handler (`middleware/errorMiddleware.js`) — Mongoose/JWT errors sab handle karta hai
- JWT auth middleware (`protect`, `authorize`) — role-based access ready
- Base `User` model — password hashing (bcrypt), roles (admin/doctor/staff/receptionist/pharmacist/lab_technician)
- Socket.io real-time layer initialized (`sockets/socketHandler.js`)
- Standard API response helper (`utils/apiResponse.js`)
- `/api/health` route — server verify karne ke liye

## Local machine par chalane ke liye:

### 1. MongoDB install/ready karein
- Local: [MongoDB Community Server](https://www.mongodb.com/try/download/community) install karein, ya
- Cloud (recommended): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) par free cluster banayein

### 2. Environment setup
```bash
cp .env.example .env
```
`.env` file kholein aur `MONGO_URI` apne MongoDB connection string se replace karein.
`JWT_SECRET` ko kisi random string se replace karein.

### 3. Install & Run
```bash
npm install
npm run dev
```

Server `http://localhost:5000` par chalega. Test karne ke liye browser me kholein:
```
http://localhost:5000/api/health
```
Response aana chahiye:
```json
{ "success": true, "message": "MediCore API is running 🏥" }
```

## Agla Step (Step 2)
**Auth Module** — Register, Login, JWT issue, Forgot/Reset Password, "Remember Me",
role-based routes (admin/doctor/staff). Frontend ke `AuthContext.jsx` se connect hoga.

## Tech Stack
Express · Mongoose (MongoDB) · JWT · bcrypt.js · Socket.io · Multer ·
express-validator · Helmet · Morgan · Nodemailer · PDFKit
