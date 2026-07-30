import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import Patients from '../pages/patients/Patients.jsx';
import PatientProfile from '../pages/patients/patientProfile.jsx';
import Doctors from '../pages/doctors/Doctors.jsx';
import DoctorProfile from '../pages/doctors/DoctorProfile.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user, loading, token } = useAuth();

  // DEBUG
  console.log('========================');
  console.log('PATH:', window.location.pathname);
  console.log('LOADING:', loading);
  console.log('TOKEN:', token);
  console.log('USER:', user);
  console.log('========================');

  // Jab tak session restore ho rahi hai
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // Agar token hai lekin user nahi, to redirect mat karo
  // (yehi tumhari problem ho sakti hai)
  if (!user && !token) {
    console.log('REDIRECTING TO LOGIN');
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Patients */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientProfile />} />

        {/* Doctors */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;