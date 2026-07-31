import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentService } from '../../services/appointmentService.js';
import AppointmentForm from '../../components/forms/AppointmentForm.jsx';
import Modal from '../../components/modals/Modal.jsx';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales,
});

const DragAndDropCalendar = withDragAndDrop(Calendar);

// Status → color mapping (jaisa design plan me tha)
const STATUS_COLORS = {
  scheduled: '#2563EB',
  confirmed: '#3B82F6',
  completed: '#10B981',
  cancelled: '#EF4444',
  no_show: '#F59E0B',
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAppointments({});
      setAppointments(res.data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Backend data ko react-big-calendar ke format me convert karte hain
  const events = useMemo(
    () =>
      appointments.map((a) => {
        const [sh, sm] = a.startTime.split(':').map(Number);
        const [eh, em] = a.endTime.split(':').map(Number);
        const start = new Date(a.date);
        start.setHours(sh, sm, 0);
        const end = new Date(a.date);
        end.setHours(eh, em, 0);

        return {
          id: a._id,
          title: `#${a.queueNumber} ${a.patient?.name || 'Patient'} — Dr. ${a.doctor?.user?.name || ''}`,
          start,
          end,
          status: a.status,
          raw: a,
        };
      }),
    [appointments]
  );

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: STATUS_COLORS[event.status] || '#2563EB',
      borderRadius: '8px',
      border: 'none',
      color: '#fff',
      fontSize: '12px',
      padding: '2px 6px',
    },
  });

  // Drag & Drop se reschedule
  const handleEventDrop = async ({ event, start }) => {
    const newDate = start.toISOString().slice(0, 10);
    const newStartTime = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;

    try {
      await appointmentService.updateAppointment(event.id, { date: newDate, startTime: newStartTime });
      toast.success('Appointment rescheduled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reschedule');
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.raw);
  };

  const handleAddAppointment = async (formData) => {
    setSubmitting(true);
    try {
      await appointmentService.createAppointment(formData);
      toast.success('Appointment booked successfully');
      setModalOpen(false);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await appointmentService.updateAppointment(selectedEvent._id, { status });
      toast.success('Status updated');
      setSelectedEvent(null);
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Appointments</h1>
          <p className="text-dark-muted text-sm mt-1">Drag & drop appointments to reschedule</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors w-fit"
        >
          <Plus size={17} /> Book Appointment
        </button>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-dark-muted capitalize">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {status.replace('_', ' ')}
          </div>
        ))}
      </div>

      <div className="glass-card p-5 calendar-dark-theme">
        {loading ? (
          <div className="skeleton h-[600px] rounded-xl" />
        ) : (
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={eventStyleGetter}
            onEventDrop={handleEventDrop}
            onSelectEvent={handleSelectEvent}
            resizable={false}
            views={['month', 'week', 'day']}
            defaultView="week"
          />
        )}
      </div>

      {/* Add Appointment Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book Appointment">
        <AppointmentForm onSubmit={handleAddAppointment} onCancel={() => setModalOpen(false)} loading={submitting} />
      </Modal>

      {/* Event details / status change modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Appointment Details">
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <p className="text-dark-text font-semibold">{selectedEvent.patient?.name}</p>
              <p className="text-dark-muted text-sm">Dr. {selectedEvent.doctor?.user?.name} — Queue #{selectedEvent.queueNumber}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-dark-muted mb-2 block">Change Status</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(STATUS_COLORS).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
                    style={{
                      backgroundColor: selectedEvent.status === status ? STATUS_COLORS[status] : 'transparent',
                      border: `1px solid ${STATUS_COLORS[status]}`,
                      color: selectedEvent.status === status ? '#fff' : STATUS_COLORS[status],
                    }}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Appointments;