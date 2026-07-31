import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CalendarCheck, Stethoscope, DollarSign, Plus, ChevronDown,
  Calendar, BedDouble, FlaskConical, Pill, UserCog, Building2, AlertTriangle, Bed,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { dashboardService } from '../../services/dashboardService.js';
import { departmentService } from '../../services/departmentService.js';
import StatCard from '../../components/cards/StatCard.jsx';
import HospitalOverviewChart from '../../components/charts/HospitalOverviewChart.jsx';
import RecentAppointmentsList from '../../components/common/RecentAppointmentsList.jsx';
import PatientsByDepartmentChart from '../../components/charts/PatientsByDepartmentChart.jsx';
import DepartmentMiniCard from '../../components/cards/DepartmentMiniCard.jsx';

const QUICK_ACTIONS = [
  { label: 'Add Patient', path: '/patients', icon: Users },
  { label: 'Add Doctor', path: '/doctors', icon: Stethoscope },
  { label: 'Book Appointment', path: '/appointments', icon: CalendarCheck },
  { label: 'Create Invoice', path: '/billing', icon: DollarSign },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [patients, doctors, appointments, revenue, pharmacy, lab, depts] = await Promise.all([
          dashboardService.getPatientStats(),
          dashboardService.getDoctorStats(),
          dashboardService.getAppointmentStats(),
          dashboardService.getRevenueStats(),
          dashboardService.getPharmacyStats(),
          dashboardService.getLabStats(),
          departmentService.getDepartments(),
        ]);
        setStats({
          patients: patients.data,
          doctors: doctors.data,
          appointments: appointments.data,
          revenue: revenue.data,
          pharmacy: pharmacy.data,
          lab: lab.data,
        });
        // Patient count / growth abhi backend me department-wise nahi hai —
        // placeholder values, jab department-wise API bane to replace karenge
        setDepartments(
          (depts.data || []).map((d, i) => ({
            ...d,
            patientCount: [892, 645, 487, 512, 384, 210][i % 6],
            growth: [6.4, 4.1, 3.7, 2.8, 1.9, 3.2][i % 6],
          }))
        );
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const revenueChartData = (stats.revenue?.trend || []).map((item) => ({ value: item.revenue }));

  const departmentPieData = departments.slice(0, 5).map((d) => ({ name: d.name, value: d.patientCount }));

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-dark-muted text-sm mt-1">Here's what's happening at your hospital today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-card/70 border border-white/[0.07] text-sm text-dark-text">
            <Calendar size={15} className="text-dark-muted" /> {today}
          </div>
          <div className="relative">
            <button
              onClick={() => setQuickOpen(!quickOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors"
            >
              <Plus size={16} /> Quick Action <ChevronDown size={14} />
            </button>
            {quickOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-dark-card border border-white/10 rounded-xl shadow-glass overflow-hidden z-20">
                {QUICK_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => { navigate(a.path); setQuickOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-muted hover:bg-dark-bg hover:text-dark-text"
                  >
                    <a.icon size={15} /> {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={stats.patients?.total ?? 0} growth={8.2}
          trend={[{ value: 20 }, { value: 25 }, { value: 22 }, { value: 30 }, { value: 28 }, { value: 35 }]}
          color="blue" delay={0} />
        <StatCard icon={CalendarCheck} label="Today's Appointments" value={stats.appointments?.total ?? 0} growth={-3.1}
          trend={[{ value: 15 }, { value: 12 }, { value: 18 }, { value: 14 }, { value: 16 }, { value: 13 }]}
          color="amber" delay={0.05} />
        <StatCard icon={Stethoscope} label="Total Doctors" value={stats.doctors?.total ?? 0} growth={2.4}
          trend={[{ value: 10 }, { value: 10 }, { value: 12 }, { value: 12 }, { value: 14 }, { value: 14 }]}
          color="emerald" delay={0.1} />
        <StatCard icon={DollarSign} label="Revenue (This Month)" value={`Rs. ${(stats.revenue?.totalRevenue ?? 0).toLocaleString()}`} growth={12.5}
          trend={revenueChartData.length ? revenueChartData : [{ value: 1 }, { value: 2 }]}
          color="violet" delay={0.15} />
      </div>

      {/* Overview + Recent Appointments + Department Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-4"><HospitalOverviewChart /></div>
        <div className="lg:col-span-3"><RecentAppointmentsList /></div>
        <div className="lg:col-span-3"><PatientsByDepartmentChart data={departmentPieData} /></div>
      </div>

      {/* Departments Overview */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-dark-text font-semibold">Departments Overview</h3>
          <button onClick={() => navigate('/departments')} className="text-xs text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {departments.slice(0, 5).map((d, i) => (
            <DepartmentMiniCard key={d._id} dept={d} index={i} />
          ))}
          <button
            onClick={() => navigate('/departments')}
            className="glass-card p-4 flex flex-col items-center justify-center gap-2 text-primary text-sm font-medium border-dashed border-2 border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <Plus size={20} /> Add Department
          </button>
        </div>
      </div>

      {/* Emergency + Bed Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-rose-400" size={18} />
                <h3 className="text-rose-400 font-semibold text-sm">Emergency Cases</h3>
              </div>
              <p className="text-3xl font-bold text-dark-text">3</p>
              <p className="text-xs text-dark-muted mt-1">Active Cases</p>
            </div>
            <button className="text-xs text-primary font-medium hover:underline self-start">View All</button>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bed className="text-emerald-400" size={18} />
              <h3 className="text-dark-text font-semibold text-sm">Bed Occupancy</h3>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="flex items-end justify-between mb-2">
            <p className="text-3xl font-bold text-dark-text">68%</p>
            <p className="text-sm text-dark-muted">68 / 100 Beds</p>
          </div>
          <div className="h-2 rounded-full bg-dark-bg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="glass-card p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-x divide-white/[0.06]">
        {[
          { icon: BedDouble, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Available Beds', value: '32', sub: '/ 100' },
          { icon: FlaskConical, color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Lab Reports (Pending)', value: stats.lab?.pending ?? 0, sub: 'Reports' },
          { icon: Pill, color: 'text-rose-400', bg: 'bg-rose-500/15', label: 'Medicine Stock Alerts', value: stats.pharmacy?.lowStockCount ?? 0, sub: 'Low Stock' },
          { icon: UserCog, color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Staff On Duty', value: '28', sub: 'Today' },
          { icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Active Wards', value: '6', sub: 'Wards' },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-3 ${i > 0 ? 'pl-4' : ''}`}>
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
              <item.icon className={item.color} size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-dark-muted truncate">{item.label}</p>
              <p className="text-sm font-semibold text-dark-text">
                {item.value} <span className="text-xs text-dark-muted font-normal">{item.sub}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;