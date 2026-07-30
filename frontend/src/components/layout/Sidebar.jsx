import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck,
  Building2,
  FlaskConical,
  Pill,
  Receipt,
  Boxes,
  BedDouble,
  IdCard,
  BarChart3,
  Settings,
  HeartPulse,
  X,
} from "lucide-react";
import { SIDEBAR_MENU, APP_NAME } from "../../utils/constants.js";

const ICONS = {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck,
  Building2,
  FlaskConical,
  Pill,
  Receipt,
  Boxes,
  BedDouble,
  IdCard,
  BarChart3,
  Settings,
};

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

     <motion.aside
  initial={false}
  animate={{
    x: window.innerWidth >= 1024 ? 0 : open ? 0 : -260,
  }}
  transition={{ duration: 0.25 }}
  className="
    fixed top-0 left-0 h-screen w-64 z-50
    bg-dark-card border-r border-dark-border
    flex flex-col shadow-xl
    lg:static
  "
>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <HeartPulse className="text-primary" size={20} />
            </div>

            <h2 className="text-lg font-bold text-dark-text">
              {APP_NAME}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-dark-muted hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {SIDEBAR_MENU.map((item) => {
            const Icon = ICONS[item.icon];

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-dark-muted hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <p className="text-xs text-center text-dark-muted">
            MediCore v1.0.0
          </p>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;