import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Loader2, Camera, Briefcase, Plus, X, Star, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import { doctorService } from '../../services/doctorService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function Profile() {
  const { user, refreshUser } = useAuth();
  const isDoctor = user?.role === 'Doctor';
  const [tab, setTab] = useState('info');

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [qualificationInput, setQualificationInput] = useState('');
  const [savingDoctor, setSavingDoctor] = useState(false);

  useEffect(() => {
    if (isDoctor) {
      doctorService.getMyProfile().then((res) => setDoctorProfile(res.data)).catch(() => {});
    }
  }, [isDoctor]);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await authService.updateProfile({ name, phone });
      toast.success('Profile updated successfully');
      refreshUser?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.updatePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const addQualification = () => {
    if (!qualificationInput.trim()) return;
    setDoctorProfile({
      ...doctorProfile,
      qualification: [...(doctorProfile.qualification || []), qualificationInput.trim()],
    });
    setQualificationInput('');
  };

  const removeQualification = (idx) => {
    setDoctorProfile({
      ...doctorProfile,
      qualification: doctorProfile.qualification.filter((_, i) => i !== idx),
    });
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setSavingDoctor(true);
    try {
      await doctorService.updateMyProfile({
        specialization: doctorProfile.specialization,
        qualification: doctorProfile.qualification,
        experience: Number(doctorProfile.experience),
        consultationFee: Number(doctorProfile.consultationFee),
      });
      toast.success('Professional info updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSavingDoctor(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">My Profile</h1>
        <p className="text-dark-muted text-sm mt-1">Manage your account information and security</p>
      </div>

      {/* Header card */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center text-primary text-2xl font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="text-lg font-bold text-dark-text">{user?.name}</p>
          <p className="text-dark-muted text-sm">{user?.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize bg-primary/15 text-primary">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-dark-card border border-dark-border w-fit">
        <button
          onClick={() => setTab('info')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'info' ? 'bg-primary text-white' : 'text-dark-muted'}`}
        >
          Profile Info
        </button>
        {isDoctor && (
          <button
            onClick={() => setTab('professional')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'professional' ? 'bg-primary text-white' : 'text-dark-muted'}`}
          >
            Professional Info
          </button>
        )}
        <button
          onClick={() => setTab('security')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'security' ? 'bg-primary text-white' : 'text-dark-muted'}`}
        >
          Security
        </button>
      </div>

      {tab === 'info' && (
        <form onSubmit={handleInfoSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
              <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} pl-10`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email (cannot be changed)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
              <input value={user?.email} disabled className={`${inputClass} pl-10 opacity-60 cursor-not-allowed`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputClass} pl-10`} placeholder="03001234567" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingInfo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow disabled:opacity-70"
            >
              {savingInfo && <Loader2 className="animate-spin" size={15} />}
              Save Changes
            </button>
          </div>
        </form>
      )}

      {tab === 'professional' && isDoctor && doctorProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <div className="glass-card p-5 text-center">
            <Briefcase className="text-primary mx-auto mb-2" size={20} />
            <p className="text-xl font-bold text-dark-text">{doctorProfile.experience}</p>
            <p className="text-xs text-dark-muted">Years Experience</p>
          </div>
          <div className="glass-card p-5 text-center">
            <Users className="text-success mx-auto mb-2" size={20} />
            <p className="text-xl font-bold text-dark-text">{doctorProfile.patientsToday ?? 0}</p>
            <p className="text-xs text-dark-muted">Patients Today</p>
          </div>
          <div className="glass-card p-5 text-center">
            <Star className="text-warning mx-auto mb-2" size={20} />
            <p className="text-xl font-bold text-dark-text">{doctorProfile.avgRating || '—'}</p>
            <p className="text-xs text-dark-muted">{doctorProfile.reviews?.length || 0} Reviews</p>
          </div>
        </div>
      )}

      {tab === 'professional' && isDoctor && (
        doctorProfile ? (
          <form onSubmit={handleDoctorSubmit} className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-dark-muted text-sm mb-2">
              <Briefcase size={16} className="text-primary" />
              {doctorProfile.department?.name} Department
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Specialization</label>
                <input
                  value={doctorProfile.specialization || ''}
                  onChange={(e) => setDoctorProfile({ ...doctorProfile, specialization: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  value={doctorProfile.experience ?? 0}
                  onChange={(e) => setDoctorProfile({ ...doctorProfile, experience: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Consultation Fee (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={doctorProfile.consultationFee ?? 0}
                  onChange={(e) => setDoctorProfile({ ...doctorProfile, consultationFee: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Qualifications</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={qualificationInput}
                  onChange={(e) => setQualificationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                  className={inputClass}
                  placeholder="e.g. FCPS Cardiology — press Enter to add"
                />
                <button
                  type="button"
                  onClick={addQualification}
                  className="px-4 rounded-xl bg-primary/15 text-primary hover:bg-primary/25 shrink-0"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(doctorProfile.qualification || []).map((q, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs">
                    {q}
                    <button type="button" onClick={() => removeQualification(idx)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingDoctor}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow disabled:opacity-70"
              >
                {savingDoctor && <Loader2 className="animate-spin" size={15} />}
                Save Professional Info
              </button>
            </div>
          </form>
        ) : (
          <div className="glass-card p-6 text-dark-muted text-sm">Loading professional info...</div>
        )
      )}

      {/* Weekly Schedule — read-only view */}
      {tab === 'professional' && isDoctor && doctorProfile && (
        <div className="glass-card p-6 mt-5">
          <h3 className="text-dark-text font-semibold mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-primary" /> Weekly Schedule
          </h3>
          {doctorProfile.schedule?.length ? (
            <div className="space-y-2">
              {doctorProfile.schedule.map((s) => (
                <div key={s.day} className="flex items-center justify-between text-sm py-1.5 border-b border-dark-border/40 last:border-0">
                  <span className="text-dark-text font-medium">{s.day}</span>
                  <span className="text-dark-muted">{s.startTime} - {s.endTime}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-muted text-sm">
              No schedule set yet. Contact admin to update your weekly schedule.
            </p>
          )}
        </div>
      )}

      {/* Patient Reviews — read-only view */}
      {tab === 'professional' && isDoctor && doctorProfile && (
        <div className="glass-card p-6 mt-5">
          <h3 className="text-dark-text font-semibold mb-3">Patient Reviews</h3>
          {doctorProfile.reviews?.length ? (
            <div className="space-y-3">
              {doctorProfile.reviews.map((r, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-dark-border/40 last:border-0">
                  <div className="flex items-center gap-1 text-warning shrink-0">
                    <Star size={13} fill="currentColor" /> {r.rating}
                  </div>
                  <div>
                    <p className="text-sm text-dark-text font-medium">{r.patient?.name || 'Patient'}</p>
                    <p className="text-sm text-dark-muted">{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-muted text-sm">No reviews yet.</p>
          )}
        </div>
      )}

      {tab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
              <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputClass} pl-10`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
              <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputClass} pl-10`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClass} pl-10`} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow disabled:opacity-70"
            >
              {savingPassword && <Loader2 className="animate-spin" size={15} />}
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;