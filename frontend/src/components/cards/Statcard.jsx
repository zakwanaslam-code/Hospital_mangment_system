import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// growth: positive/negative % | trend: [{value: number}, ...] mini graph data
function StatCard({ icon: Icon, label, value, growth, trend, color = 'primary', delay = 0 }) {
  const isPositive = growth >= 0;

  const colorMap = {
    primary: { bg: 'bg-primary/15', text: 'text-primary', stroke: '#2563EB' },
    success: { bg: 'bg-success/15', text: 'text-success', stroke: '#10B981' },
    warning: { bg: 'bg-warning/15', text: 'text-warning', stroke: '#F59E0B' },
    danger: { bg: 'bg-danger/15', text: 'text-danger', stroke: '#EF4444' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
            <Icon className={c.text} size={19} />
          </div>
          <p className="text-dark-muted text-xs font-medium">{label}</p>
          <p className="text-2xl font-bold text-dark-text mt-1">{value}</p>

          {growth !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(growth)}%
              <span className="text-dark-muted font-normal">vs last week</span>
            </div>
          )}
        </div>

        {/* Mini graph */}
        {trend && trend.length > 0 && (
          <div className="w-16 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={c.stroke}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;