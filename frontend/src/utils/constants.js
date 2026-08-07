// === Central design tokens (mirrors tailwind.config.js) ===
export const COLORS = {
  primary: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bgDark: '#000000',
  cardDark: '#0A0A0D',
  border: '#1F1F26',
  textLight: '#F8FAFC',
};

// === Sidebar menu structure — Step 3 me Sidebar.jsx isko consume karega ===
// icon names Lucide React se match karte hain
export const SIDEBAR_MENU = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', roles: null },
  { label: 'Patients', icon: 'Users', path: '/patients', roles: null },
  { label: 'Doctors', icon: 'Stethoscope', path: '/doctors', roles: ['admin', 'receptionist'] },
  { label: 'Appointments', icon: 'CalendarCheck', path: '/appointments', roles: null },
  { label: 'Departments', icon: 'Building2', path: '/departments', roles: ['admin'] },
  { label: 'Laboratory', icon: 'FlaskConical', path: '/laboratory', roles: ['admin', 'doctor', 'lab_technician'] },
  { label: 'Pharmacy', icon: 'Pill', path: '/pharmacy', roles: ['admin', 'pharmacist'] },
  { label: 'Billing', icon: 'Receipt', path: '/billing', roles: ['admin', 'receptionist'] },
  { label: 'Inventory', icon: 'Boxes', path: '/inventory', roles: ['admin'] },
  { label: 'Ward Management', icon: 'BedDouble', path: '/wards', roles: ['admin', 'doctor'] },
  { label: 'Staff', icon: 'IdCard', path: '/staff', roles: ['admin'] },
  { label: 'Reports', icon: 'BarChart3', path: '/reports', roles: ['admin'] },
  { label: 'Settings', icon: 'Settings', path: '/settings', roles: ['admin'] },
];

export const APP_NAME = 'MediCore';
