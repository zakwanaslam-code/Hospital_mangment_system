import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, HeartPulse, Loader2, Users, CalendarCheck,
  Pill, FlaskConical, Receipt, ShieldCheck, Moon, Sun, LockKeyhole,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import loginIllustration from '../../assets/login-illustration.jpg';

const FEATURES = [
  { icon: Users, label: 'Patient Management' },
  { icon: CalendarCheck, label: 'Appointments' },
  { icon: Pill, label: 'Pharmacy' },
  { icon: FlaskConical, label: 'Laboratory' },
  { icon: Receipt, label: 'Billing & Reports' },
  { icon: ShieldCheck, label: 'Secure & Compliant' },
];

const STATS = [
  { value: '500+', label: 'Active Patients', icon: Users },
  { value: '50+', label: 'Specialist Doctors', icon: Users },
  { value: '24/7', label: 'Emergency Support', icon: HeartPulse },
  { value: '99.9%', label: 'System Uptime', icon: ShieldCheck },
];

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-dark-bg px-4 py-8">
      {/* Animated gradient background blobs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl pointer-events-none"
        animate={{ x: [0, 100, 0], y: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-15%', left: '-10%' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none"
        animate={{ x: [0, -80, 0], y: [0, -50, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '-15%', right: '-10%' }}
      />

      <div className="relative z-10 grid lg:grid-cols-2 gap-6 max-w-6xl w-full items-stretch">
        {/* === Left: Illustration + Feature Panel === */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-between bg-dark-card/50 backdrop-blur-xl
                     border border-white/10 shadow-glass rounded-3xl p-10 relative overflow-hidden"
        >
          {/* Logo */}
          <div>
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-5">
              <HeartPulse className="text-primary" size={26} />
            </div>
            <h2 className="text-3xl font-bold text-dark-text mb-2">
              MediCore <span className="text-primary">EMR</span>
            </h2>
            <p className="text-dark-muted text-sm">Enterprise Hospital Management System</p>
            <p className="text-dark-muted text-sm mt-1 leading-relaxed">
              Patients, Doctors, Appointments, Billing, Pharmacy aur Laboratory
              sab ek jagah, <span className="text-primary">real-time.</span>
            </p>
          </div>

          {/* Illustration */}
          <div className="relative flex-1 flex items-center justify-center my-6">
            <img
              src={loginIllustration}
              alt="Doctors using MediCore EMR"
              className="max-h-64 w-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="text-primary" size={15} />
                </div>
                <span className="text-sm text-dark-text/90">{label}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 pt-6 border-t border-dark-border/60">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="text-primary mx-auto mb-1" size={16} />
                <p className="text-lg font-bold text-dark-text">{value}</p>
                <p className="text-[10px] text-dark-muted leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* === Right: Login Form === */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-dark-card/60 backdrop-blur-xl border border-white/10
                     shadow-glass rounded-3xl p-8 sm:p-10 w-full flex flex-col justify-center relative"
        >
          {/* Theme toggle — top right */}
          <button
            onClick={toggleTheme}
            className="absolute top-6 right-6 flex items-center gap-1 p-1 rounded-full
                       bg-dark-bg/60 border border-dark-border"
          >
            <span className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-primary/20' : ''}`}>
              <Sun size={13} className={theme === 'light' ? 'text-primary' : 'text-dark-muted'} />
            </span>
            <span className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-primary/20' : ''}`}>
              <Moon size={13} className={theme === 'dark' ? 'text-primary' : 'text-dark-muted'} />
            </span>
          </button>

          <div className="flex items-center gap-3 mb-2 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <HeartPulse className="text-primary" size={20} />
            </div>
            <span className="font-display font-bold text-dark-text text-lg">MediCore</span>
          </div>

          <h1 className="text-2xl font-bold text-dark-text mt-4">Welcome back 👋</h1>
          <p className="text-dark-muted text-sm mt-1 mb-8">
            Apne account me login karein continue karne ke liye
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-dark-muted mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medicore.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-bg/60 border border-dark-border
                             text-dark-text placeholder:text-dark-muted/60 outline-none
                             focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark-muted mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-dark-bg/60 border border-dark-border
                             text-dark-text placeholder:text-dark-muted/60 outline-none
                             focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-dark-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                Remember Me
              </label>
              <a href="/forgot-password" className="text-primary hover:underline">
                Forgot Password?
              </a>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-700 text-white
                         font-semibold shadow-glow transition-colors flex items-center
                         justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span className="text-lg">→</span>
                </>
              )}
            </motion.button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-dark-border" />
            <span className="text-xs text-dark-muted">OR</span>
            <div className="flex-1 h-px bg-dark-border" />
          </div>

          {/* SSO button */}
          <button
            type="button"
            className="w-full py-3 rounded-xl border border-dark-border text-dark-text
                       font-medium text-sm flex items-center justify-center gap-2
                       hover:bg-dark-bg/50 transition-colors"
          >
            <ShieldCheck size={17} className="text-dark-muted" />
            Login with SSO
          </button>

          {/* Security footer */}
          <p className="flex items-center justify-center gap-1.5 text-xs text-dark-muted mt-6">
            <LockKeyhole size={12} />
            Your data is 100% secure and encrypted
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;