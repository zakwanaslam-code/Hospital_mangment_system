import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  BedDouble,
  Stethoscope,
  UserCog,
  Pencil,
} from "lucide-react";

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { wardService } from '../../services/wardService.js';
import WardForm from '../../components/forms/WardForm.jsx';
import AssignBedModal from '../../components/modals/AssignBedModal.jsx';
import Modal from '../../components/modals/Modal.jsx';



function WardManagement() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null); // { ward, bedNumber }
  const [bedInfo, setBedInfo] = useState(null); // occupied bed details view
  const [editingWard, setEditingWard] = useState(null);


  const fetchWards = useCallback(async () => {
  setLoading(true);

  try {
    const res = await wardService.getWards();

    console.log("WARDS DATA:", res.data);

    setWards(res.data);
  } catch (err) {
    toast.error("Failed to load wards");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { fetchWards(); }, [fetchWards]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try { await wardService.createWard(data); toast.success('Ward created'); setModalOpen(false); fetchWards(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to create ward'); }
    finally { setSubmitting(false); }
  };

  const handleUpdate = async (data) => {
  setSubmitting(true);

  try {
    await wardService.updateWard(editingWard._id, data);

    toast.success("Ward updated successfully");

    setEditingWard(null);
    setModalOpen(false);

    fetchWards();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update ward");
  } finally {
    setSubmitting(false);
  }
};
  

  const handleBedClick = (ward, bed) => {
    if (bed.status === 'available') {
      setAssignTarget({ ward, bedNumber: bed.bedNumber });
    } else if (bed.status === 'occupied') {
      setBedInfo({ ward, bed });
    }
  };

  const handleAssign = async (patientId) => {
    setSubmitting(true);
    try {
      await wardService.updateBedStatus(assignTarget.ward._id, {
        bedNumber: assignTarget.bedNumber,
        status: 'occupied',
        patientId,
      });
      toast.success('Patient assigned to bed');
      setAssignTarget(null);
      fetchWards();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign bed');
    } finally { setSubmitting(false); }
  };

  const handleDischarge = async () => {
    setSubmitting(true);
    try {
      await wardService.updateBedStatus(bedInfo.ward._id, {
        bedNumber: bedInfo.bed.bedNumber,
        status: 'available',
        patientId: null,
      });
      toast.success('Patient discharged, bed freed');
      setBedInfo(null);
      fetchWards();
    } catch (err) {
      toast.error('Failed to discharge');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-dark-text">Ward Management</h1><p className="text-dark-muted text-sm mt-1">{wards.length} wards — click a bed to assign or view patient</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow w-fit"><Plus size={17} /> Add Ward</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="skeleton h-56 rounded-2xl" />)}</div>
      ) : wards.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">Koi ward nahi mila.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {wards.map((ward, i) => (
            <motion.div key={ward._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }} className="glass-card p-5">
             <div className="flex items-start justify-between mb-3">
  <div>
    <p className="font-semibold text-dark-text">{ward.name}</p>

    <p className="text-xs text-dark-muted capitalize">
      {ward.wardType} • {ward.floor || "N/A"}
    </p>
  </div>

  <div className="flex items-center gap-3">

    <button
      className="p-2 rounded-lg hover:bg-dark-hover transition"
      title="Edit Ward"
    onClick={() => {
  setEditingWard({
    ...ward,
    assignedDoctor: ward.assignedDoctor?._id || "",
  });

  setModalOpen(true);
}}
    >
      <Pencil size={16} className="text-primary" />
    </button>

    <div className="flex items-center gap-2 text-sm">
      <BedDouble className="text-primary" size={16} />

      <span className="text-dark-text font-semibold">
        {ward.beds?.filter((b) => b.status === "occupied").length}/{ward.totalBeds}
      </span>
    </div>

  </div>
</div>
              {/* Doctor + In-charge info */}
              <div className="flex flex-wrap gap-3 mb-4 pb-3 border-b border-dark-border/60">
                <div className="flex items-center gap-1.5 text-xs text-dark-muted">
                  <Stethoscope size={13} className="text-primary" />

                 {
                   ward.assignedDoctor?.user?.name
                     ? ward.assignedDoctor.user.name.startsWith("Dr.")
                     ? ward.assignedDoctor.user.name
                     : `Dr. ${ward.assignedDoctor.user.name}`
                     : "No doctor assigned"
                   }
                </div>
                {ward.inCharge && (
                  <div className="flex items-center gap-1.5 text-xs text-dark-muted">
                    <UserCog size={13} className="text-primary" />
                    {ward.inCharge}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {ward.beds?.map((bed) => (
                  <button
                    key={bed.bedNumber}
                    onClick={() => handleBedClick(ward, bed)}
                    title={bed.status === 'occupied' ? `${bed.bedNumber} — ${bed.patient?.name || 'Occupied'}` : bed.bedNumber}
                    className={`aspect-square rounded-lg text-[9px] font-medium flex items-center justify-center transition-colors ${
                      bed.status === 'occupied' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' :
                      bed.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
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

     <Modal
  isOpen={modalOpen}
  onClose={() => {
    setModalOpen(false);
    setEditingWard(null);
  }}
  title={editingWard ? "Edit Ward" : "Add New Ward"}
>
  <WardForm
    initialData={editingWard}
    onSubmit={editingWard ? handleUpdate : handleCreate}
    onCancel={() => {
      setModalOpen(false);
      setEditingWard(null);
    }}
    loading={submitting}
  />
</Modal>

      {/* Assign patient to available bed */}
      <Modal isOpen={!!assignTarget} onClose={() => setAssignTarget(null)} title="Assign Bed">
        {assignTarget && (
          <AssignBedModal
            bedNumber={assignTarget.bedNumber}
            onAssign={handleAssign}
            onCancel={() => setAssignTarget(null)}
            loading={submitting}
          />
        )}
      </Modal>

      {/* View occupied bed info + discharge */}
      <Modal isOpen={!!bedInfo} onClose={() => setBedInfo(null)} title="Bed Details">
        {bedInfo && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text font-semibold">{bedInfo.bed.bedNumber}</p>
                <p className="text-xs text-dark-muted">{bedInfo.ward.name}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/15 text-rose-400">Occupied</span>
            </div>
            <div className="bg-dark-bg/50 rounded-xl p-4">
              <p className="text-xs text-dark-muted mb-1">Patient</p>
              <p className="text-sm text-dark-text font-medium">{bedInfo.bed.patient?.name || 'Unknown'}</p>
              <p className="text-xs text-dark-muted">{bedInfo.bed.patient?.patientId}</p>
            </div>
            <button
              onClick={handleDischarge}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold disabled:opacity-70"
            >
              Discharge Patient & Free Bed
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default WardManagement;