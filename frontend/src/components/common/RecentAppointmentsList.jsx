import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService.js';

const STATUS_STYLE = {
  scheduled: 'bg-blue-500/15 text-blue-400',
  confirmed: 'bg-emerald-500/15 text-emerald-400',
  completed: 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-rose-500/15 text-rose-400',
  no_show: 'bg-amber-500/15 text-amber-400',
  pending: 'bg-amber-500/15 text-amber-400',
};

function RecentAppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService
      .getAppointments({})
      .then((res) => setAppointments((res.data || []).slice(0, 5)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-dark-text font-semibold">Recent Appointments</h3>
        <button className="text-xs text-primary font-medium hover:underline">View All</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-dark-muted text-sm py-8 text-center">Koi appointment nahi mila.</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a._id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                {a.patient?.name?.charAt(0) || 'P'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-dark-text font-medium truncate">{a.patient?.name}</p>
                <p className="text-xs text-dark-muted truncate">{a.department?.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-dark-muted">{a.startTime}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${STATUS_STYLE[a.status] || STATUS_STYLE.pending}`}>
                  {a.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentAppointmentsList;