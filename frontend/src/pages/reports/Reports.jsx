import { useState, useEffect, useCallback } from 'react';
import { Users, CalendarCheck, Stethoscope, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { reportService } from '../../services/reportService.js';
import StatCard from '../../components/cards/StatCard.jsx';

const STATUS_COLORS = { scheduled: '#3B82F6', confirmed: '#3B82F6', completed: '#10B981', cancelled: '#F43F5E', no_show: '#F59E0B' };

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try { const res = await reportService.getOverview({ from, to }); setData(res.data); }
    finally { setLoading(false); }
  }, [from, to]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const revenueChartData = (data?.revenueByDay || []).map((d) => ({ date: d._id.slice(5), revenue: d.revenue }));
  const statusPieData = (data?.appointmentsByStatus || []).map((s) => ({ name: s._id, value: s.count }));

  if (loading || !data) return <div className="skeleton h-96 rounded-2xl" />;

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-dark-text">Reports & Analytics</h1><p className="text-dark-muted text-sm mt-1">Hospital performance overview</p></div>
        <div className="flex gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text text-sm outline-none" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text text-sm outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={data.totalPatients} color="blue" />
        <StatCard icon={CalendarCheck} label="Total Appointments" value={data.totalAppointments} color="amber" />
        <StatCard icon={Stethoscope} label="Total Doctors" value={data.totalDoctors} color="emerald" />
        <StatCard icon={DollarSign} label="Revenue Collected" value={`Rs. ${data.totalPaid.toLocaleString()}`} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-dark-text font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F26" vertical={false} />
                <XAxis dataKey="date" stroke="#8B8B96" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B8B96" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-dark-text font-semibold mb-4">Appointments by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {statusPieData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || '#3B82F6'} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Reports;