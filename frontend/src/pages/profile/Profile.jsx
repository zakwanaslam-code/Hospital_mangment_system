import { useState } from 'react';
import { User, Mail, Phone, Lock, Loader2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text ' +
  'placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function Profile() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState('info');

  // Profile info form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingInfo, setSavingInfo] = useState(false);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

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
        <button
          onClick={() => setTab('security')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'security' ? 'bg-primary text-white' : 'text-dark-muted'}`}
        >
          Security
        </button>
      </div>

      {tab === 'info' ? (
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
      ) : (
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