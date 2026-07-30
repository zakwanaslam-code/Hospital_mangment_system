import { useState, useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { doctorService } from '../../services/doctorService.js';
import { departmentService } from '../../services/departmentService.js';
import DoctorCard from '../../components/cards/DoctorCard.jsx';
import DoctorForm from '../../components/forms/DoctorForm.jsx';
import Modal from '../../components/modals/Modal.jsx';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await doctorService.getDoctors({ search, department });
      setDoctors(res.data);
    } catch (err) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [search, department]);

  useEffect(() => {
    departmentService.getDepartments().then((res) => setDepartments(res.data || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleAddDoctor = async (formData) => {
    setSubmitting(true);
    try {
      await doctorService.createDoctor(formData);
      toast.success('Doctor added successfully');
      setModalOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Doctors</h1>
          <p className="text-dark-muted text-sm mt-1">{doctors.length} doctors on staff</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors w-fit"
        >
          <Plus size={17} /> Add Doctor
        </button>
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialization..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text placeholder:text-dark-muted/60 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text text-sm outline-none"
        >
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      ) : doctors.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">
          Koi doctor nahi mila. "Add Doctor" se naya add karein.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((d, i) => <DoctorCard key={d._id} doctor={d} delay={i * 0.03} />)}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Doctor" maxWidth="max-w-2xl">
        <DoctorForm onSubmit={handleAddDoctor} onCancel={() => setModalOpen(false)} loading={submitting} />
      </Modal>
    </div>
  );
}

export default Doctors;