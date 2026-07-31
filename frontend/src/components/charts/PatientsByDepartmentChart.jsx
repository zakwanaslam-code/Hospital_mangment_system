import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E', '#06B6D4'];

function PatientsByDepartmentChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-dark-text font-semibold">Patients by Department</h3>
        <button className="text-xs text-primary font-medium hover:underline">View All</button>
      </div>

      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-dark-text">{total.toLocaleString()}</p>
          <p className="text-xs text-dark-muted">Total</p>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-dark-muted">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {d.name}
            </span>
            <span className="text-dark-text font-medium">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientsByDepartmentChart;