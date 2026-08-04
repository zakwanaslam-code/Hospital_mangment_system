import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
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

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientProfile />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/laboratory" element={<Laboratory />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/wards" element={<WardManagement />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;