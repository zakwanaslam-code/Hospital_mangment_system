import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '../../context/AuthContext.jsx';
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
import hospitalImage from "../../assets/sidebar-hospital.jpg";

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

const ITEM_COLORS = {
  Dashboard: "text-blue-500",
  Patients: "text-emerald-500",
  Doctors: "text-cyan-500",
  Appointments: "text-amber-500",
  Departments: "text-violet-500",
  Laboratory: "text-fuchsia-500",
  Pharmacy: "text-teal-500",
  Billing: "text-rose-500",
  Inventory: "text-orange-500",
  "Ward Management": "text-indigo-500",
  Staff: "text-sky-500",
  Reports: "text-lime-600",
  Settings: "text-slate-500",
};

function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const visibleMenu = SIDEBAR_MENU.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <>
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
          flex flex-col shadow-[2px_0_12px_rgba(15,23,42,0.04)]
          lg:static
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10
                            ring-1 ring-primary/30 flex items-center justify-center
                            shadow-[0_0_16px_-4px_rgba(37,99,235,0.6)]">
              <HeartPulse className="text-primary" size={20} />
            </div>
            <h2 className="text-lg font-bold text-dark-text tracking-tight">
              {APP_NAME}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-dark-muted hover:text-dark-text"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

           {visibleMenu.map((item) => {
            const Icon = ICONS[item.icon];
            const accent = ITEM_COLORS[item.label] || "text-primary";

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
                  `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "bg-gradient-to-r from-primary/15 to-primary/5 text-dark-text ring-1 ring-primary/20 shadow-[0_0_20px_-6px_rgba(37,99,235,0.35)]"
                      : "text-dark-text/70 hover:bg-primary/5 hover:text-dark-text"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                    )}
                    <Icon
                      size={18}
                      className={isActive ? "text-primary" : accent}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <p className="text-xs text-center text-dark-muted/70">
            MediCore v1.0.0
          </p>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;