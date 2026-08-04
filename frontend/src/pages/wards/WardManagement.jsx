import { useState, useEffect, useCallback } from 'react';
import { Plus, BedDouble } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { wardService } from '../../services/wardService.js';
import WardForm from '../../components/forms/WardForm.jsx';
import Modal from '../../components/modals/Modal.jsx';

function WardManagement() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchWards = useCallback(async () => {
    setLoading(true);
    try { const res = await wardService.getWards(); setWards(res.data); }
    catch (err) { toast.error('Failed to load wards'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWards(); }, [fetchWards]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try { await wardService.createWard(data); toast.success('Ward created'); setModalOpen(false); fetchWards(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to create ward'); }
    finally { setSubmitting(false); }
  };

  const toggleBed = async (ward, bed) => {
    const newStatus = bed.status === 'available' ? 'occupied' : 'available';
    // Simplified toggle — real "occupied" flow patient select karega, abhi demo ke liye direct toggle
    try {
      await wardService.updateBedStatus(ward._id, { bedNumber: bed.bedNumber, status: newStatus, patientId: null });
      fetchWards();
    } catch (err) { toast.error('Failed to update bed'); }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-dark-text">Ward Management</h1><p className="text-dark-muted text-sm mt-1">{wards.length} wards</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow w-fit"><Plus size={17} /> Add Ward</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}</div>
      ) : wards.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">Koi ward nahi mila.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {wards.map((ward, i) => (
            <motion.div key={ward._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }} className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-dark-text">{ward.name}</p>
                  <p className="text-xs text-dark-muted capitalize">{ward.wardType} • {ward.floor || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BedDouble className="text-primary" size={16} />
                  <span className="text-dark-text font-semibold">{ward.occupiedCount}/{ward.totalBeds}</span>
                </div>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {ward.beds.map((bed) => (
                  <button
                    key={bed.bedNumber}
                    onClick={() => toggleBed(ward, bed)}
                    title={bed.bedNumber}
                    className={`aspect-square rounded-lg text-[9px] font-medium flex items-center justify-center transition-colors ${
                      bed.status === 'occupied' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      bed.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {bed.bedNumber.split('-')[1]}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-[11px] text-dark-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"/> Available</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"/> Occupied</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"/> Maintenance</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Ward">
        <WardForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} loading={submitting} />
      </Modal>
    </div>
  );
}
export default WardManagement;