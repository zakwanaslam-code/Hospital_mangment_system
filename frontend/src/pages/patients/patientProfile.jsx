import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Droplet, Calendar, Building2, User as UserIcon } from 'lucide-react';
import { patientService } from '../../services/patientService.js';

function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getPatientById(id).then((res) => {
      setPatient(res.data);
      setLoading(false);
    });
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
        <span className="px-3 py-1.5 rounded-full text-xs font-medium capitalize bg-success/15 text-success h-fit">
          {patient.status}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-dark-text font-semibold mb-4">Medical Timeline</h3>
          <p className="text-dark-muted text-sm">
            Appointments aur visits yahan dikhengi — Appointment Module (Step 6) me connect karenge.
          </p>
        </div>

        <div className="glass-card p-5 lg:col-span-3">
          <h3 className="text-dark-text font-semibold mb-4">Billing History</h3>
          <p className="text-dark-muted text-sm">
            Invoices yahan dikhengi — Billing Module (Step 7) me connect karenge.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;