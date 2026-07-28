import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, HeartPulse, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-dark-bg px-4">
      {/* Animated gradient background blobs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/25 blur-3xl pointer-events-none"
        animate={{ x: [0, 100, 0], y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-10%', left: '-10%' }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-success/15 blur-3xl pointer-events-none"
        animate={{ x: [0, -80, 0], y: [0, -50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '-10%', right: '-10%' }}
      />

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 max-w-5xl w-full items-center">
       {/* === Left: Hospital Info Card — hamesha dark glass, theme se independent === */}
<motion.div
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="hidden lg:block bg-dark-card/50 backdrop-blur-xl border border-white/10
             shadow-glass rounded-3xl p-10"
>
  <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
    <HeartPulse className="text-primary" size={32} />
  </div>

  <h2 className="text-3xl font-bold text-dark-text mb-3">
    MediCore EMR
  </h2>

  <p className="text-dark-muted mb-8 leading-relaxed">
    Enterprise Hospital Management System — Patients, Doctors,
    Appointments, Billing, Pharmacy aur Laboratory sab ek jagah,
    real-time.
  </p>

  <div className="space-y-4">
    ...
  </div>
</motion.div>

        {/* === Right: Login Form — hamesha dark glass === */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-dark-card/60 backdrop-blur-xl border border-white/10
                     shadow-glass rounded-3xl p-8 sm:p-10 w-full"
        >
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
                'Login'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;