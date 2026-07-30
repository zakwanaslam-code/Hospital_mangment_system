import { motion } from 'framer-motion';
import { Star, Briefcase, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DoctorCard({ doctor, delay = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/doctors/${doctor._id}`)}
      className="glass-card p-5 cursor-pointer text-center"
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center text-primary text-xl font-bold mb-3">
        {doctor.user?.name?.charAt(0)}
      </div>
      <p className="font-semibold text-dark-text">{doctor.user?.name}</p>
      <p className="text-xs text-primary mt-0.5">{doctor.specialization}</p>

      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-warning">
        <Star size={12} fill="currentColor" />
        {doctor.avgRating || 'New'} {doctor.reviews?.length ? `(${doctor.reviews.length})` : ''}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-dark-muted">
        <span className="flex items-center gap-1"><Briefcase size={12} /> {doctor.experience} yrs</span>
        <span className="flex items-center gap-1"><Building2 size={12} /> {doctor.department?.name}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-dark-border/40">
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
          doctor.status === 'active' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
        }`}>
          {doctor.status.replace('_', ' ')}
        </span>
      </div>
    </motion.div>
  );
}

export default DoctorCard;