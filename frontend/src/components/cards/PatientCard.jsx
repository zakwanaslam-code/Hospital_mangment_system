import { motion } from "framer-motion";
import { Phone, Droplet, Building2, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Map patient status values to Tailwind CSS color classes.
const STATUS_COLORS = {
  active: "bg-success/15 text-success",
  inactive: "bg-dark-muted/15 text-dark-muted",
  admitted: "bg-warning/15 text-warning",
  discharged: "bg-primary/15 text-primary",
};

function PatientCard({ patient, delay = 0 }) {
  const navigate = useNavigate();

  // Navigate to the patient detail page when the card is clicked.
  const handleClick = () => {
    console.log("Patient Clicked:", patient);
    console.log("Patient ID:", patient._id);

    navigate(`/patients/${patient._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      onClick={handleClick}
      className="glass-card p-5 cursor-pointer"
    >
      {/* Header section with avatar initial, patient name, and patient ID */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-semibold">
            {patient.name?.charAt(0)}
          </div>

          <div>
            <p className="font-semibold text-dark-text text-sm">
              {patient.name}
            </p>

            <p className="text-xs text-dark-muted">
              {patient.patientId}
            </p>
          </div>
        </div>

        {/* Prevent the menu button click from triggering the whole card click */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-dark-muted hover:text-dark-text"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Contact info, blood group, age and optional department */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs text-dark-muted">
          <Phone size={12} />
          {patient.phone}
        </div>

        <div className="flex items-center gap-2 text-xs text-dark-muted">
          <Droplet size={12} />
          {patient.bloodGroup} • {patient.age ?? "—"} yrs
        </div>

        {patient.department && (
          <div className="flex items-center gap-2 text-xs text-dark-muted">
            <Building2 size={12} />
            {patient.department.name}
          </div>
        )}
      </div>

      {/* Status badge with dynamic color styling based on current patient status */}
      <span
        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${STATUS_COLORS[patient.status]}`}
      >
        {patient.status}
      </span>
    </motion.div>
  );
}

export default PatientCard;