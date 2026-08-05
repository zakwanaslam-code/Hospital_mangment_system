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
  Dashboard: "text-blue-400",
  Patients: "text-emerald-400",
  Doctors: "text-cyan-400",
  Appointments: "text-amber-400",
  Departments: "text-violet-400",
  Laboratory: "text-fuchsia-400",
  Pharmacy: "text-teal-400",
  Billing: "text-rose-400",
  Inventory: "text-orange-400",
  "Ward Management": "text-indigo-400",
  Staff: "text-sky-400",
  Reports: "text-lime-400",
  Settings: "text-slate-400",
};

function Sidebar({ open, onClose }) {
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
          bg-dark-bg border-r border-dark-border
          flex flex-col shadow-2xl
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
          {SIDEBAR_MENU.map((item) => {
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
                      ? "bg-gradient-to-r from-primary/25 to-primary/5 text-dark-text ring-1 ring-primary/30 shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)]"
                      : "text-dark-muted hover:bg-primary/5 hover:text-dark-text"
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
                      className={isActive ? "text-primary" : `${accent} opacity-80 group-hover:opacity-100`}
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