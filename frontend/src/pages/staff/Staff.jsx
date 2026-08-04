import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, IdCard, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffService } from '../../services/staffService.js';
import StaffForm from '../../components/forms/StaffForm.jsx';
import Modal from '../../components/modals/Modal.jsx';

const ROLE_COLORS = {
  receptionist: 'bg-blue-500/15 text-blue-400',
  pharmacist: 'bg-cyan-500/15 text-cyan-400',
  lab_technician: 'bg-violet-500/15 text-violet-400',
  staff: 'bg-emerald-500/15 text-emerald-400',
};

function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try { const res = await staffService.getStaff({ search }); setStaff(res.data); }
    catch (err) { toast.error('Failed to load staff'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { const t = setTimeout(fetchStaff, 300); return () => clearTimeout(t); }, [fetchStaff]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try { await staffService.createStaff(data); toast.success('Staff added'); setModalOpen(false); fetchStaff(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to add staff'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try { await staffService.deleteStaff(id); toast.success('Staff removed'); setDeleteTarget(null); fetchStaff(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-dark-text">Staff</h1><p className="text-dark-muted text-sm mt-1">{staff.length} staff members</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow w-fit"><Plus size={17} /> Add Staff</button>
      </div>

      <div className="glass-card p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text text-sm outline-none focus:border-primary" />
        </div>
      </div>

      {loading ? (
        <div className="skeleton h-96 rounded-2xl" />
      ) : staff.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">Koi staff member nahi mila.</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-dark-muted text-xs uppercase">
                  <th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s._id} className="border-b border-white/[0.05] last:border-0 hover:bg-dark-bg/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold">{s.name?.charAt(0)}</div>
                        <span className="text-dark-text font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-dark-muted">{s.email}</td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${ROLE_COLORS[s.role] || ROLE_COLORS.staff}`}>{s.role.replace('_',' ')}</span></td>
                    <td className="px-5 py-3 text-dark-muted">{s.department?.name || '—'}</td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${s.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-dark-muted/15 text-dark-muted'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-5 py-3">
                      <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-rose-400"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <StaffForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} loading={submitting} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Staff">
        <p className="text-dark-muted text-sm mb-6">Remove <span className="text-dark-text font-medium">{deleteTarget?.name}</span>?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg">Cancel</button>
          <button onClick={() => handleDelete(deleteTarget._id)} className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold">Remove</button>
        </div>
      </Modal>
    </div>
  );
}
export default Staff;