import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, FileText, CreditCard, UserPlus, AlertTriangle } from 'lucide-react';
import { io } from 'socket.io-client';

const ICON_MAP = {
  appointment: { icon: CalendarCheck, color: 'text-primary' },
  lab: { icon: FileText, color: 'text-success' },
  payment: { icon: CreditCard, color: 'text-warning' },
  patient: { icon: UserPlus, color: 'text-primary' },
  alert: { icon: AlertTriangle, color: 'text-danger' },
};

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000');

    const pushActivity = (type, message) => {
      setActivities((prev) =>
        [{ id: Date.now(), type, message, time: 'Just now' }, ...prev].slice(0, 8)
      );
    };

    socket.on('appointment:new', (data) =>
      pushActivity('appointment', `${data.patient?.name || 'Patient'} booked an appointment`)
    );
    socket.on('lab:completed', (data) =>
      pushActivity('lab', `Lab report ready: ${data.testName}`)
    );
    socket.on('invoice:new', (data) =>
      pushActivity('payment', `Invoice ${data.invoiceNumber} created`)
    );
    socket.on('medicine:lowStock', (data) =>
      pushActivity('alert', `Low stock: ${data.name} (${data.stockQuantity} left)`)
    );

    return () => socket.disconnect();
  }, []);

  return (
    <div className="glass-card p-5">
      <h3 className="text-dark-text font-semibold mb-4">Recent Activity</h3>

      {activities.length === 0 ? (
        <p className="text-dark-muted text-sm py-6 text-center">
          Koi recent activity nahi — real-time updates yahan aayenge.
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {activities.map((activity) => {
              const config = ICON_MAP[activity.type] || ICON_MAP.appointment;
              const Icon = config.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 py-2 border-b border-dark-border/40 last:border-0"
                >
                  <div className={`w-8 h-8 rounded-lg bg-dark-bg flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-dark-text truncate">{activity.message}</p>
                    <p className="text-xs text-dark-muted">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default RecentActivity;