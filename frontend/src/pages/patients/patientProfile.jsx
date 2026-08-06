import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Droplet, Calendar, Building2, User as UserIcon, Clock, Receipt, Download } from 'lucide-react';
import { patientService } from '../../services/patientService.js';
import { appointmentService } from '../../services/appointmentService.js';
import { invoiceService } from '../../services/invoiceService.js';

const APPT_STATUS_COLORS = {
  scheduled: 'bg-blue-500/15 text-blue-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-rose-500/15 text-rose-400',
  no_show: 'bg-amber-500/15 text-amber-400',
};

const INVOICE_STATUS_COLORS = {
  unpaid: 'bg-rose-500/15 text-rose-400',
  partial: 'bg-amber-500/15 text-amber-400',
  paid: 'bg-emerald-500/15 text-emerald-400',
  refunded: 'bg-dark-muted/15 text-dark-muted',
};

function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [patientRes, apptRes, invoiceRes] = await Promise.all([
          patientService.getPatientById(id),
          appointmentService.getAppointments({ patient: id }),
          invoiceService.getInvoices({ patient: id }),
        ]);
        setPatient(patientRes.data);
        setAppointments(apptRes.data || []);
        setInvoices(invoiceRes.data || []);
      } catch (err) {
        console.error('Failed to load patient profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  if (!patient) {
    return <p className="text-dark-muted">Patient not found.</p>;
  }

  return (
    <div className="animate-fadeIn space-y-5">
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-sm text-dark-muted hover:text-dark-text"
      >
        <ArrowLeft size={16} /> Back to Patients
      </button>

      {/* Header card */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
          {patient.name?.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-dark-text">{patient.name}</h1>
          <p className="text-dark-muted text-sm">{patient.patientId}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-dark-muted">
            <span className="flex items-center gap-1.5"><Phone size={14} /> {patient.phone}</span>
            {patient.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {patient.email}</span>}
            <span className="flex items-center gap-1.5"><Droplet size={14} /> {patient.bloodGroup}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {patient.age} years</span>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-medium capitalize bg-emerald-500/15 text-emerald-400 h-fit">
          {patient.status}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Basic Info */}
        <div className="glass-card p-5">
          <h3 className="text-dark-text font-semibold mb-4 flex items-center gap-2">
            <UserIcon size={16} className="text-primary" /> Basic Info
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-dark-muted">Gender</span><span className="text-dark-text capitalize">{patient.gender}</span></div>
            <div className="flex justify-between"><span className="text-dark-muted">Date of Birth</span><span className="text-dark-text">{new Date(patient.dob).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-dark-muted">Department</span><span className="text-dark-text">{patient.department?.name || '—'}</span></div>
            <div className="flex justify-between"><span className="text-dark-muted">Assigned Doctor</span><span className="text-dark-text">{patient.assignedDoctor?.name || '—'}</span></div>
          </div>
        </div>

        {/* Medical Timeline — real appointments */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-dark-text font-semibold flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Medical Timeline
            </h3>
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs text-primary font-medium hover:underline"
            >
              Book New
            </button>
          </div>

          {appointments.length === 0 ? (
            <p className="text-dark-muted text-sm py-6 text-center">
              Is patient ka koi appointment record nahi hai.
            </p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div key={appt._id} className="flex items-center gap-3 py-2 border-b border-dark-border/40 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Calendar className="text-primary" size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-dark-text font-medium">
                      Dr. {appt.doctor?.user?.name || 'N/A'} — {appt.department?.name}
                    </p>
                    <p className="text-xs text-dark-muted">
                      {new Date(appt.date).toLocaleDateString()} at {appt.startTime}
                      {appt.reason ? ` • ${appt.reason}` : ''}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize shrink-0 ${APPT_STATUS_COLORS[appt.status] || APPT_STATUS_COLORS.scheduled}`}>
                    {appt.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing History — real invoices */}
        <div className="glass-card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-dark-text font-semibold flex items-center gap-2">
              <Receipt size={16} className="text-primary" /> Billing History
            </h3>
            <button
              onClick={() => navigate('/billing')}
              className="text-xs text-primary font-medium hover:underline"
            >
              Create Invoice
            </button>
          </div>

          {invoices.length === 0 ? (
            <p className="text-dark-muted text-sm py-6 text-center">
              Is patient ka koi invoice nahi hai.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border text-left text-dark-muted text-xs uppercase">
                    <th className="py-2.5 font-medium">Invoice #</th>
                    <th className="py-2.5 font-medium">Total</th>
                    <th className="py-2.5 font-medium">Paid</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 font-medium">Date</th>
                    <th className="py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="border-b border-dark-border/40 last:border-0">
                      <td className="py-2.5 text-dark-text font-medium">{inv.invoiceNumber}</td>
                      <td className="py-2.5 text-dark-text">Rs. {inv.totalAmount?.toLocaleString()}</td>
                      <td className="py-2.5 text-dark-muted">Rs. {inv.amountPaid?.toLocaleString()}</td>
                      <td className="py-2.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${INVOICE_STATUS_COLORS[inv.paymentStatus]}`}>
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="py-2.5 text-dark-muted">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="py-2.5">
                       <button
  onClick={async () => {
    try {
      await invoiceService.downloadPDF(inv._id, inv.invoiceNumber);
    } catch (err) {
      console.error(err);
    }
  }}
  className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-primary"
  title="Download PDF"
>
  <Download size={14} />
</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;