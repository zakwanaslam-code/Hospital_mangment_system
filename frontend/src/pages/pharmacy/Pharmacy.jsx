import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { pharmacyService } from '../../services/pharmacyService.js';
import MedicineForm from '../../components/forms/MedicineForm.jsx';
import MedicineCard from '../../components/cards/MedicineCard.jsx';
import Modal from '../../components/modals/Modal.jsx';

function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search };
      if (filter === 'lowStock') params.lowStock = 'true';
      if (filter === 'expiringSoon') params.expiringSoon = 'true';
      const res = await pharmacyService.getMedicines(params);
      setMedicines(res.data);
    } catch (err) {
      toast.error('Failed to load medicines');
    } finally { setLoading(false); }
  }, [search, filter]);

  useEffect(() => {
    const t = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(t);
  }, [fetchMedicines]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await pharmacyService.updateMedicine(editing._id, data);
        toast.success('Medicine updated');
      } else {
        await pharmacyService.addMedicine(data);
        toast.success('Medicine added');
      }
      setModalOpen(false); setEditing(null);
      fetchMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save medicine');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await pharmacyService.deleteMedicine(id);
      toast.success('Medicine deleted');
      setDeleteTarget(null);
      fetchMedicines();
    } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Pharmacy</h1>
          <p className="text-dark-muted text-sm mt-1">{medicines.length} medicines in stock</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow w-fit">
          <Plus size={17} /> Add Medicine
        </button>
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicine..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text text-sm outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2">
          {['', 'lowStock', 'expiringSoon'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-dark-bg/60 text-dark-muted border border-white/10'}`}>
              {f === '' ? 'All' : f === 'lowStock' ? 'Low Stock' : 'Expiring Soon'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(8)].map((_,i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>
      ) : medicines.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">Koi medicine nahi mila.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {medicines.map((m, i) => (
            <MedicineCard key={m._id} medicine={m} delay={i*0.03} onEdit={(med) => { setEditing(med); setModalOpen(true); }} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Medicine' : 'Add Medicine'} maxWidth="max-w-2xl">
        <MedicineForm initialData={editing} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditing(null); }} loading={submitting} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Medicine">
        <p className="text-dark-muted text-sm mb-6">Delete <span className="text-dark-text font-medium">{deleteTarget?.name}</span>?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg">Cancel</button>
          <button onClick={() => handleDelete(deleteTarget._id)} className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
export default Pharmacy;