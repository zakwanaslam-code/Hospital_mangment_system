import { Moon, Sun, HeartPulse } from 'lucide-react';
import { useTheme } from './context/ThemeContext.jsx';

// NOTE: Ye sirf Step 1 ka verification screen hai.
// Step 2 me isko <AppRoutes /> se replace karenge (src/routes/AppRoutes.jsx)
// jisme Login Page, Dashboard Layout, aur saare modules mount honge.

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg transition-colors duration-300 px-4">
      <div className="glass-card p-10 max-w-md w-full text-center animate-fadeIn">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/15 flex items-center justify-center">
          <HeartPulse className="text-primary" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
          MediCore Setup ✅
        </h1>
        <p className="text-light-muted dark:text-dark-muted text-sm mb-6">
          Step 1 complete — project scaffold, Tailwind theme, aur glassmorphism
          styles ready hain. Agla step: Login Page.
        </p>
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary
                     text-white font-medium text-sm hover:bg-primary-700
                     transition-colors shadow-glow"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </div>
  );
}

export default App;
