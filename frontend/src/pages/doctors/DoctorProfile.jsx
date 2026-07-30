import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Briefcase, Building2, Mail, Phone, Calendar, Users } from 'lucide-react';
import { doctorService } from '../../services/doctorService.js';

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService.getDoctorById(id).then((res) => {
      setDoctor(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;
  if (!doctor) return <p className="text-dark-muted">Doctor not found.</p>;

  return (
    <div className="animate-fadeIn space-y-5">
      <button onClick={() => navigate('/doctors')} className="flex items-center gap-2 text-sm text-dark-muted hover:text-dark-text">
        <ArrowLeft size={16} /> Back to Doctors
      </button>

      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
          {doctor.user?.name?.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-dark-text">{doctor.user?.name}</h1>
          <p className="text-primary text-sm">{doctor.specialization}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-dark-muted">
            <span className="flex items-center gap-1.5"><Mail size={14} /> {doctor.user?.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> {doctor.user?.phone}</span>
            <span className="flex items-center gap-1.5"><Building2 size={14} /> {doctor.department?.name}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-warning justify-center">
            <Star size={16} fill="currentColor" />
            <span className="font-bold text-dark-text text-lg">{doctor.avgRating || '—'}</span>
          </div>
          <p className="text-xs text-dark-muted">{doctor.reviews?.length || 0} reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="glass-card p-5 text-center">
          <Briefcase className="text-primary mx-auto mb-2" size={20} />
          <p className="text-xl font-bold text-dark-text">{doctor.experience}</p>
          <p className="text-xs text-dark-muted">Years Experience</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Users className="text-success mx-auto mb-2" size={20} />
          <p className="text-xl font-bold text-dark-text">{doctor.patientsToday ?? 0}</p>
          <p className="text-xs text-dark-muted">Patients Today</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Calendar className="text-warning mx-auto mb-2" size={20} />
          <p className="text-xl font-bold text-dark-text">Rs. {doctor.consultationFee}</p>
          <p className="text-xs text-dark-muted">Consultation Fee</p>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-dark-text font-semibold mb-3">Qualifications</h3>
          <div className="flex flex-wrap gap-2">
            {doctor.qualification?.map((q, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs">{q}</span>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-dark-text font-semibold mb-3">Weekly Schedule</h3>
          <div className="space-y-2">
            {doctor.schedule?.map((s) => (
              <div key={s.day} className="flex items-center justify-between text-sm py-1.5 border-b border-dark-border/40 last:border-0">
                <span className="text-dark-text font-medium">{s.day}</span>
                <span className="text-dark-muted">{s.startTime} - {s.endTime}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 lg:col-span-3">
          <h3 className="text-dark-text font-semibold mb-3">Patient Reviews</h3>
          {doctor.reviews?.length ? (
            <div className="space-y-3">
              {doctor.reviews.map((r, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-dark-border/40 last:border-0">
                  <div className="flex items-center gap-1 text-warning shrink-0">
                    <Star size={13} fill="currentColor" /> {r.rating}
                  </div>
                  <p className="text-sm text-dark-muted">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-muted text-sm">Abhi koi review nahi hai.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;