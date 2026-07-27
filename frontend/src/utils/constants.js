// === Central design tokens (mirrors tailwind.config.js) ===
export const COLORS = {
  primary: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bgDark: '#0F172A',
  cardDark: '#1E293B',
  border: '#334155',
  textLight: '#F8FAFC',
};

// === Sidebar menu structure — Step 3 me Sidebar.jsx isko consume karega ===
// icon names Lucide React se match karte hain
export const SIDEBAR_MENU = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  { label: 'Patients', icon: 'Users', path: '/patients' },
  { label: 'Doctors', icon: 'Stethoscope', path: '/doctors' },
  { label: 'Appointments', icon: 'CalendarCheck', path: '/appointments' },
  { label: 'Departments', icon: 'Building2', path: '/departments' },
  { label: 'Laboratory', icon: 'FlaskConical', path: '/laboratory' },
  { label: 'Pharmacy', icon: 'Pill', path: '/pharmacy' },
  { label: 'Billing', icon: 'Receipt', path: '/billing' },
  { label: 'Inventory', icon: 'Boxes', path: '/inventory' },
  { label: 'Ward Management', icon: 'BedDouble', path: '/wards' },
  { label: 'Staff', icon: 'IdCard', path: '/staff' },
  { label: 'Reports', icon: 'BarChart3', path: '/reports' },
  { label: 'Settings', icon: 'Settings', path: '/settings' },
];

export const APP_NAME = 'MediCore';
