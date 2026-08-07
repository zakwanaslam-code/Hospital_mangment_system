import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import LandingPage from '../pages/landing/LandingPage.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Patients from '../pages/patients/Patients.jsx';
import PatientProfile from '../pages/patients/PatientProfile.jsx';
import Doctors from '../pages/doctors/Doctors.jsx';
import DoctorProfile from '../pages/doctors/DoctorProfile.jsx';
import Appointments from '../pages/appointments/Appointments.jsx';
import Departments from '../pages/departments/Departments.jsx';
import Laboratory from '../pages/laboratory/Laboratory.jsx';
import Billing from '../pages/billing/Billing.jsx';
import Pharmacy from '../pages/pharmacy/Pharmacy.jsx';
import Inventory from '../pages/inventory/Inventory.jsx';
import WardManagement from '../pages/wards/WardManagement.jsx';
import Staff from '../pages/staff/Staff.jsx';
import Reports from '../pages/reports/Reports.jsx';
import Settings from '../pages/settings/Settings.jsx';
import Profile from '../pages/profile/Profile.jsx';
import { SIDEBAR_MENU } from '../utils/constants.js';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Sidebar ke roles config se hi decide karta hai ke ye route is user ke role ke liye allowed hai ya nahi
function RoleProtectedRoute({ children, path }) {
  const { user } = useAuth();
  const menuItem = SIDEBAR_MENU.find((item) => item.path === path);
  const allowed = !menuItem?.roles || menuItem.roles.includes(user?.role);

  if (!allowed) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientProfile />} />

        <Route path="/doctors" element={
          <RoleProtectedRoute path="/doctors"><Doctors /></RoleProtectedRoute>
        } />
        <Route path="/doctors/:id" element={
          <RoleProtectedRoute path="/doctors"><DoctorProfile /></RoleProtectedRoute>
        } />

        <Route path="/appointments" element={<Appointments />} />

        <Route path="/departments" element={
          <RoleProtectedRoute path="/departments"><Departments /></RoleProtectedRoute>
        } />

        <Route path="/laboratory" element={
          <RoleProtectedRoute path="/laboratory"><Laboratory /></RoleProtectedRoute>
        } />

        <Route path="/billing" element={
          <RoleProtectedRoute path="/billing"><Billing /></RoleProtectedRoute>
        } />

        <Route path="/pharmacy" element={
          <RoleProtectedRoute path="/pharmacy"><Pharmacy /></RoleProtectedRoute>
        } />

        <Route path="/inventory" element={
          <RoleProtectedRoute path="/inventory"><Inventory /></RoleProtectedRoute>
        } />

        <Route path="/wards" element={
          <RoleProtectedRoute path="/wards"><WardManagement /></RoleProtectedRoute>
        } />

        <Route path="/staff" element={
          <RoleProtectedRoute path="/staff"><Staff /></RoleProtectedRoute>
        } />

        <Route path="/reports" element={
          <RoleProtectedRoute path="/reports"><Reports /></RoleProtectedRoute>
        } />

        <Route path="/settings" element={
          <RoleProtectedRoute path="/settings"><Settings /></RoleProtectedRoute>
        } />

        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;