import { motion } from 'framer-motion';
import { Phone, Droplet, Building2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  active: 'bg-success/15 text-success',
  inactive: 'bg-dark-muted/15 text-dark-muted',
  admitted: 'bg-warning/15 text-warning',
  discharged: 'bg-primary/15 text-primary',
};

function PatientCard({ patient, delay = 0, onDelete }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/patients/${patient._id}`)}
      className="glass-card p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-semibold">
            {patient.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-dark-text text-sm">{patient.name}</p>
            <p className="text-xs text-dark-muted">{patient.patientId}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(patient);
          }}
          className="p-1.5 rounded-lg text-dark-muted hover:bg-danger/10 hover:text-danger"
          title="Remove Patient"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs text-dark-muted">
          <Phone size={12} /> {patient.phone}
        </div>
        <div className="flex items-center gap-2 text-xs text-dark-muted">
          <Droplet size={12} /> {patient.bloodGroup} • {patient.age ?? '—'} yrs
        </div>
        {patient.department && (
          <div className="flex items-center gap-2 text-xs text-dark-muted">
            <Building2 size={12} /> {patient.department.name}
          </div>
        )}
      </div>

      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${STATUS_COLORS[patient.status]}`}>
        {patient.status}
      </span>
    </motion.div>
  );
}

export default PatientCard;