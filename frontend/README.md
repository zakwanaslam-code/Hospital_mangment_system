# MediCore — Hospital EMR Frontend (MERN)

Enterprise-grade Hospital Management System frontend — Dark/Light glassmorphism UI.

## Step 1 — Setup complete ✅

Is step me ye ban chuka hai:
- Vite + React project structure
- Complete folder architecture (`components`, `pages`, `layouts`, `context`, `services`, `routes`, `hooks`, `utils`)
- Tailwind config with full color palette (Primary #2563EB, Success #10B981, Warning #F59E0B, Danger #EF4444, dark bg #0F172A)
- Dark/Light mode system (`ThemeContext.jsx`) with localStorage persistence
- Glassmorphism utility classes (`.glass-card`, `.nav-item`, `.skeleton`)
- Auth context skeleton (`AuthContext.jsx`)
- Axios API service layer (`services/api.js`)
- Central design tokens + sidebar menu config (`utils/constants.js`)

## Local machine par chalane ke liye:

```bash
npm install
npm run dev
```

Browser me `http://localhost:5173` khulega — aapko ek confirmation card dikhega
jisme dark/light mode toggle button hoga. Agar wo kaam kare, Step 1 successful hai.

## Agla Step (Step 2)
Login Page — Hospital Logo, animated background, email/password form,
"Remember Me", "Forgot Password" — sab kuch is folder structure ke andar:
`src/pages/` (naya `auth` folder) + `src/components/forms/`.

## Tech Stack
React 18 · Vite · TailwindCSS · Framer Motion · Lucide React · Recharts ·
React Router · Zustand · React Hook Form + Zod · Socket.io Client · Axios
