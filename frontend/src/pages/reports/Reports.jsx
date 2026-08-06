import { useState, useEffect, useCallback } from 'react';
import { Users, CalendarCheck, Stethoscope, DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { reportService } from '../../services/reportService.js';
import StatCard from '../../components/cards/StatCard.jsx';

const STATUS_COLORS = {
  scheduled: '#3B82F6',
  confirmed: '#3B82F6',
  completed: '#10B981',
  cancelled: '#F43F5E',
  no_show: '#F59E0B',
};

const DATE_PRESETS = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'This Year', days: 365 },
];

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activePreset, setActivePreset] = useState(1);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.getOverview({ from, to });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const applyPreset = (days, idx) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setFrom(start.toISOString().slice(0, 10));
    setTo(end.toISOString().slice(0, 10));
    setActivePreset(idx);
  };

  useEffect(() => { applyPreset(30, 1); }, []);

  const revenueChartData = (data?.revenueByDay || []).map((d) => ({ date: d._id.slice(5), revenue: d.revenue }));
  const statusPieData = (data?.appointmentsByStatus || []).map((s) => ({ name: s._id.replace('_', ' '), value: s.count, key: s._id }));
  const totalAppts = statusPieData.reduce((sum, s) => sum + s.value, 0);
  const collectionRate = data?.totalRevenue ? Math.round((data.totalPaid / data.totalRevenue) * 100) : 0;

  if (loading || !data) return <div className="skeleton h-96 rounded-2xl" />;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-1">Analytics</p>
          <h1 className="text-2xl font-bold text-dark-text">Reports & Analytics</h1>
          <p className="text-dark-muted text-sm mt-1">Hospital performance overview</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-dark-text text-sm font-medium hover:bg-dark-bg transition-colors w-fit">
          <Download size={15} /> Export Report
        </button>
      </div>

      {/* Date range controls */}
      <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((p, idx) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.days, idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                activePreset === idx ? 'bg-primary text-white' : 'bg-dark-bg/60 text-dark-muted border border-dark-border'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted pointer-events-none" size={14} />
            <input
              type="date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setActivePreset(-1); }}
              className="pl-8 pr-3 py-2 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text text-sm outline-none"
            />
          </div>
          <span className="text-dark-muted text-sm">to</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted pointer-events-none" size={14} />
            <input
              type="date"
              value={to}
              onChange={(e) => { setTo(e.target.value); setActivePreset(-1); }}
              className="pl-8 pr-3 py-2 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={data.totalPatients} color="blue" />
        <StatCard icon={CalendarCheck} label="Total Appointments" value={data.totalAppointments} color="amber" />
        <StatCard icon={Stethoscope} label="Total Doctors" value={data.totalDoctors} color="emerald" />
        <StatCard icon={DollarSign} label="Revenue Collected" value={`Rs. ${data.totalPaid.toLocaleString()}`} color="violet" />
      </div>

      {/* Revenue + Collection summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-dark-muted text-xs font-medium uppercase tracking-wide mb-1">Total Billed</p>
          <p className="text-2xl font-bold text-dark-text">Rs. {data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-dark-muted text-xs font-medium uppercase tracking-wide mb-1">Collection Rate</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-dark-text">{collectionRate}%</p>
            <div className="flex-1 h-2 rounded-full bg-dark-bg overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${collectionRate}%` }} />
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <p className="text-dark-muted text-xs font-medium uppercase tracking-wide mb-1">Completion Rate</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={20} />
            <p className="text-2xl font-bold text-dark-text">
              {totalAppts ? Math.round(((statusPieData.find(s => s.key === 'completed')?.value || 0) / totalAppts) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-dark-text font-semibold mb-4">Revenue Trend</h3>
          {revenueChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-dark-muted text-sm">
              No revenue data in this date range
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F26" vertical={false} />
                  <XAxis dataKey="date" stroke="#8B8B96" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8B8B96" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[6,6,0,0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-dark-text font-semibold mb-4">Appointments by Status</h3>
          {statusPieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-dark-muted text-sm">
              No appointments in this date range
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {statusPieData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.key] || '#3B82F6'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', color: '#8B8B96', textTransform: 'capitalize' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Status breakdown table */}
      <div className="glass-card p-5">
        <h3 className="text-dark-text font-semibold mb-4">Appointment Status Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statusPieData.map((s) => (
            <div key={s.key} className="rounded-xl border border-dark-border p-3 text-center">
              <div
                className="w-2.5 h-2.5 rounded-full mx-auto mb-2"
                style={{ backgroundColor: STATUS_COLORS[s.key] || '#3B82F6' }}
              />
              <p className="text-lg font-bold text-dark-text">{s.value}</p>
              <p className="text-[11px] text-dark-muted capitalize mt-0.5">{s.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;