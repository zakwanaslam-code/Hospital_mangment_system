import { useEffect, useState } from 'react';
import { Users, CalendarCheck, Stethoscope, DollarSign, BedDouble, FlaskConical, Pill, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { dashboardService } from '../../services/dashboardService.js';
import StatCard from '../../components/cards/Statcard.jsx';
import RevenueChart from '../../components/charts/RevenueChart.jsx';
import DepartmentChart from '../../components/charts/DepartmentChart.jsx';
import RecentActivity from '../../components/common/RecentActivity.jsx';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    patients: null,
    doctors: null,
    appointments: null,
    revenue: null,
    pharmacy: null,
    lab: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [patients, doctors, appointments, revenue, pharmacy, lab] = await Promise.all([
          dashboardService.getPatientStats(),
          dashboardService.getDoctorStats(),
          dashboardService.getAppointmentStats(),
          dashboardService.getRevenueStats(),
          dashboardService.getPharmacyStats(),
          dashboardService.getLabStats(),
        ]);
        setStats({
          patients: patients.data,
          doctors: doctors.data,
          appointments: appointments.data,
          revenue: revenue.data,
          pharmacy: pharmacy.data,
          lab: lab.data,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, []);

  const revenueChartData = (stats.revenue?.trend || []).map((item) => ({
    date: new Date(item._id).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
    revenue: item.revenue,
  }));

  const departmentData = [
    { name: 'Cardiology', value: 35 },
    { name: 'Neurology', value: 22 },
    { name: 'Orthopedics', value: 18 },
    { name: 'Pediatrics', value: 15 },
    { name: 'General', value: 10 },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">
          Welcome back {user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-dark-muted text-sm mt-1 ">
          Here's what's happening at your hospital today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.patients?.total ?? 0}
          growth={8.2}
          trend={[{ value: 20 }, { value: 25 }, { value: 22 }, { value: 30 }, { value: 28 }, { value: 35 }]}
          color="primary"
          delay={0}
        />
        <StatCard
          icon={CalendarCheck}
          label="Today's Appointments"
          value={stats.appointments?.total ?? 0}
          growth={-3.1}
          trend={[{ value: 15 }, { value: 12 }, { value: 18 }, { value: 14 }, { value: 16 }, { value: 13 }]}
          color="warning"
          delay={0.05}
        />
        <StatCard
          icon={Stethoscope}
          label="Doctors"
          value={stats.doctors?.total ?? 0}
          growth={2.4}
          trend={[{ value: 10 }, { value: 10 }, { value: 12 }, { value: 12 }, { value: 14 }, { value: 14 }]}
          color="success"
          delay={0.1}
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={`Rs. ${(stats.revenue?.totalRevenue ?? 0).toLocaleString()}`}
          growth={12.5}
          trend={revenueChartData.map((d) => ({ value: d.revenue }))}
          color="primary"
          delay={0.15}
        />
        <StatCard
          icon={BedDouble}
          label="Available Beds"
          value="42"
          growth={0}
          trend={[{ value: 40 }, { value: 42 }, { value: 38 }, { value: 45 }, { value: 42 }, { value: 42 }]}
          color="success"
          delay={0.2}
        />
        <StatCard
          icon={FlaskConical}
          label="Lab Reports (Pending)"
          value={stats.lab?.pending ?? 0}
          growth={-5.0}
          trend={[{ value: 8 }, { value: 6 }, { value: 9 }, { value: 5 }, { value: 7 }, { value: 4 }]}
          color="warning"
          delay={0.25}
        />
        <StatCard
          icon={Pill}
          label="Medicine Stock"
          value={stats.pharmacy?.totalMedicines ?? 0}
          growth={1.8}
          trend={[{ value: 200 }, { value: 210 }, { value: 195 }, { value: 220 }, { value: 205 }, { value: 215 }]}
          color="primary"
          delay={0.3}
        />
        <StatCard
          icon={AlertCircle}
          label="Emergency Cases"
          value="3"
          growth={0}
          color="danger"
          delay={0.35}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueChartData} />
        </div>
        <DepartmentChart data={departmentData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"></div>
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;