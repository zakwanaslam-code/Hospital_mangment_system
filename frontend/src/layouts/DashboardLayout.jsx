import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Navbar from '../components/layout/Navbar.jsx';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
       <main className="flex-1 overflow-y-auto p-4 sm:p-6 pt-20">
          {/* Har route (Dashboard, Patients, Doctors, etc.) yahan render hoga */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;