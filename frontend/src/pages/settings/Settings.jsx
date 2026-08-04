import { useState } from 'react';
import { Building2, Palette, DollarSign, Mail, Bell, Database, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'currency', label: 'Currency', icon: DollarSign },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'backup', label: 'Backup', icon: Database },
];

const inputClass = 'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text placeholder:text-dark-muted/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function Settings() {
  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState({
    hospitalName: 'MediCore Hospital',
    address: '',
    phone: '',
    currency: 'PKR',
    smtpEmail: '',
    notifyAppointments: true,
    notifyLowStock: true,
    notifyLabReports: true,
  });

  const handleSave = () => {
    // TODO: backend Settings model bante hi isko API call se replace karenge
    toast.success('Settings saved successfully');
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div><h1 className="text-2xl font-bold text-dark-text">Settings</h1><p className="text-dark-muted text-sm mt-1">Manage hospital configuration</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="glass-card p-3 h-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
                tab === t.id ? 'bg-primary/15 text-primary' : 'text-dark-muted hover:bg-dark-bg/50'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 glass-card p-6">
          {tab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-dark-text font-semibold mb-2">Hospital Information</h3>
              <div>
                <label className={labelClass}>Hospital Logo</label>
                <div className="w-20 h-20 rounded-xl bg-dark-bg/60 border border-dashed border-white/20 flex items-center justify-center text-dark-muted text-xs cursor-pointer hover:border-primary/50">
                  Upload
                </div>
              </div>
              <div><label className={labelClass}>Hospital Name</label><input value={settings.hospitalName} onChange={(e) => setSettings({...settings, hospitalName: e.target.value})} className={inputClass} /></div>
              <div><label className={labelClass}>Address</label><input value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} className={inputClass} /></div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-dark-text font-semibold mb-2">Theme Colors</h3>
              <div className="grid grid-cols-4 gap-3">
                {['#2563EB', '#8B5CF6', '#10B981', '#F43F5E'].map((c) => (
                  <button key={c} className="h-12 rounded-xl border-2 border-white/10 hover:border-white/30" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="text-xs text-dark-muted">App is dark-mode by design — enterprise consistency ke liye theme toggle disable hai.</p>
            </div>
          )}

          {tab === 'currency' && (
            <div className="space-y-4">
              <h3 className="text-dark-text font-semibold mb-2">Currency Settings</h3>
              <div>
                <label className={labelClass}>Default Currency</label>
                <select value={settings.currency} onChange={(e) => setSettings({...settings, currency: e.target.value})} className={inputClass}>
                  <option value="PKR">PKR — Pakistani Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="AED">AED — UAE Dirham</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-4">
              <h3 className="text-dark-text font-semibold mb-2">Email (SMTP) Settings</h3>
              <div><label className={labelClass}>SMTP Email</label><input value={settings.smtpEmail} onChange={(e) => setSettings({...settings, smtpEmail: e.target.value})} className={inputClass} placeholder="notifications@medicore.com" /></div>
              <p className="text-xs text-dark-muted">Ye backend .env file me configure hota hai — yahan sirf display purpose ke liye hai.</p>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-dark-text font-semibold mb-2">Notification Preferences</h3>
              {[
                { key: 'notifyAppointments', label: 'New Appointment Alerts' },
                { key: 'notifyLowStock', label: 'Low Medicine Stock Alerts' },
                { key: 'notifyLabReports', label: 'Lab Report Ready Alerts' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-dark-text">{item.label}</span>
                  <button
                    onClick={() => setSettings({...settings, [item.key]: !settings[item.key]})}
                    className={`w-11 h-6 rounded-full transition-colors relative ${settings[item.key] ? 'bg-primary' : 'bg-dark-bg border border-white/10'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'backup' && (
            <div className="space-y-4">
              <h3 className="text-dark-text font-semibold mb-2">Backup & Data</h3>
              <p className="text-sm text-dark-muted">Database MongoDB Atlas par hosted hai — automatic cloud backups Atlas dashboard se manage hote hain.</p>
              <button className="px-4 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text text-sm hover:bg-dark-bg">
                Export Data (Coming Soon)
              </button>
            </div>
          )}

          <div className="flex justify-end pt-6 mt-6 border-t border-white/10">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Settings;