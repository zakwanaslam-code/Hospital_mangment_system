import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, LayoutGrid, List, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { patientService } from '../../services/patientService.js';
import PatientCard from '../../components/cards/PatientCard.jsx';
import PatientTable from '../../components/tables/PatientTable.jsx';
import PatientForm from '../../components/forms/PatientForm.jsx';
import Modal from '../../components/modals/Modal.jsx';
import toast from 'react-hot-toast';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // grid | table
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await patientService.getPatients({ search, status, page, limit: 9 });
      setPatients(res.data);
      setMeta(res.meta);
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    const timer = setTimeout(fetchPatients, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchPatients]);

  const handleAddPatient = async (formData) => {
    setSubmitting(true);
    try {
      await patientService.createPatient(formData);
      toast.success('Patient registered successfully');
      setModalOpen(false);
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add patient');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Patients</h1>
          <p className="text-dark-muted text-sm mt-1">{meta.total} total patients registered</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700
                     text-white text-sm font-semibold shadow-glow transition-colors w-fit"
        >
          <Plus size={17} /> Add Patient
        </button>
      </div>

      {/* Filters bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={17} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, ID or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border
                       text-dark-text placeholder:text-dark-muted/60 text-sm outline-none
                       focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="admitted">Admitted</option>
          <option value="discharged">Discharged</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* View toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-dark-bg/60 border border-dark-border">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary/20 text-primary' : 'text-dark-muted'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-colors ${view === 'table' ? 'bg-primary/20 text-primary' : 'text-dark-muted'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : patients.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">
          Koi patient nahi mila. "Add Patient" se naya register karein.
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p, i) => <PatientCard key={p._id} patient={p} delay={i * 0.03} />)}
        </div>
      ) : (
        <PatientTable patients={patients} />
      )}

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-lg border border-dark-border text-dark-muted disabled:opacity-40 hover:text-dark-text"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-dark-muted px-3">
            Page {page} of {meta.pages}
          </span>
          <button
            disabled={page === meta.pages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-lg border border-dark-border text-dark-muted disabled:opacity-40 hover:text-dark-text"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add Patient Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Patient">
        <PatientForm onSubmit={handleAddPatient} onCancel={() => setModalOpen(false)} loading={submitting} />
      </Modal>
    </div>
  );
}

export default Patients;