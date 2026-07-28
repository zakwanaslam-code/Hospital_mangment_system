import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Stethoscope, CalendarCheck, Building2,
  FlaskConical, Pill, Receipt, Boxes, BedDouble, IdCard, BarChart3,
  Settings, HeartPulse, X,
} from 'lucide-react';
import { SIDEBAR_MENU, APP_NAME } from '../../utils/constants.js';

// Icon name (string) ko actual Lucide component se map karta hai
const ICONS = {
  LayoutDashboard, Users, Stethoscope, CalendarCheck, Building2,
  FlaskConical, Pill, Receipt, Boxes, BedDouble, IdCard, BarChart3, Settings,
};

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay — sidebar khuli ho to background dim ho jaye */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="fixed lg:static lg:translate-x-0 top-0 left-0 h-screen w-64 z-40
                   bg-dark-card/80 backdrop-blur-xl border-r border-dark-border/60
                   flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-dark-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <HeartPulse className="text-primary" size={18} />
            </div>
            <span className="font-display font-bold text-dark-text">{APP_NAME}</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-dark-muted hover:text-dark-text">
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {SIDEBAR_MENU.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border/60">
          <p className="text-xs text-dark-muted text-center">MediCore v1.0.0</p>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;