import { useState } from 'react';
import { Menu, Search, Bell, MessageSquare, Moon, Sun, ChevronDown, LogOut, User } from 'lucide-react';import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
  <header className="sticky top-0 z-[9999] h-16 flex items-center justify-between gap-4 px-4 sm:px-6
                    bg-dark-bg/90 backdrop-blur-xl border-b-2 border-[#2563EB]
                    shadow-[0_2px_15px_rgba(37,99,235,0.15)]">
      {/* Left: menu toggle + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-dark-muted hover:bg-dark-card hover:text-dark-text"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden sm:block max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
          <input
            type="text"
            placeholder="Search patient..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-card border border-dark-border
                       text-sm text-dark-text placeholder:text-dark-muted outline-none
                       focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="p-2.5 rounded-xl text-dark-muted hover:bg-dark-card hover:text-dark-text relative">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulseSoft" />
        </button>

        <button className="p-2.5 rounded-xl text-dark-muted hover:bg-dark-card hover:text-dark-text">
          <MessageSquare size={19} />
        </button>

        

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-dark-muted hover:bg-dark-card hover:text-dark-text"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Profile dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl hover:bg-dark-card"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden sm:block text-sm text-dark-text font-medium">
              {user?.name || 'Admin'}
            </span>
            <ChevronDown size={14} className="hidden sm:block text-dark-muted" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border
                           rounded-xl shadow-glass overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-dark-border">
                  <p className="text-sm font-medium text-dark-text">{user?.name}</p>
                  <p className="text-xs text-dark-muted capitalize">{user?.role}</p>
                </div>
               <button
  onClick={() => { navigate('/profile'); setProfileOpen(false); }}
  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dark-muted hover:bg-dark-bg hover:text-dark-text"
>
  <User size={15} /> My Profile
</button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10"
                >
                  <LogOut size={15} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Navbar;