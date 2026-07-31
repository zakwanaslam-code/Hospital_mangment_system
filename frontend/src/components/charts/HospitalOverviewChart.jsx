import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// TODO: Backend me ek combined weekly-stats API bante hi isko replace karenge —
// abhi weekly trend ka koi single endpoint nahi hai, isliye placeholder pattern hai
const DATA = [
  { day: 'Mon', patients: 42, appointments: 28, emergency: 4 },
  { day: 'Tue', patients: 55, appointments: 34, emergency: 6 },
  { day: 'Wed', patients: 48, appointments: 30, emergency: 5 },
  { day: 'Thu', patients: 61, appointments: 38, emergency: 7 },
  { day: 'Fri', patients: 85, appointments: 52, emergency: 8 },
  { day: 'Sat', patients: 70, appointments: 45, emergency: 6 },
  { day: 'Sun', patients: 58, appointments: 40, emergency: 5 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-card border border-white/10 rounded-lg px-3 py-2 shadow-glass">
      <p className="text-xs text-dark-muted mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

function HospitalOverviewChart() {
  const [range, setRange] = useState('This Week');

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-dark-text font-semibold">Hospital Overview</h3>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-xs bg-dark-bg/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-dark-muted outline-none"
        >
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F26" vertical={false} />
            <XAxis dataKey="day" stroke="#8B8B96" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#8B8B96" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#8B8B96' }}
              formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <Line type="monotone" dataKey="patients" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="appointments" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="emergency" stroke="#F43F5E" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HospitalOverviewChart;