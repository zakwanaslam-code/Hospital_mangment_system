import { useState, useEffect, useCallback } from 'react';
import { Plus, Building2, Pencil, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { departmentService } from '../../services/departmentService.js';
import DepartmentForm from '../../components/forms/DepartmentForm.jsx';
import Modal from '../../components/modals/Modal.jsx';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await departmentService.getDepartments();
      setDepartments(res.data);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepartments = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingDept) {
        await departmentService.updateDepartment(editingDept._id, formData);
        toast.success('Department updated successfully');
      } else {
        await departmentService.createDepartment(formData);
        toast.success('Department added successfully');
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await departmentService.deleteDepartment(id);
      toast.success('Department deleted');
      setDeleteConfirm(null);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete department');
    }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Departments</h1>
          <p className="text-dark-muted text-sm mt-1">{departments.length} departments</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors w-fit"
        >
          <Plus size={17} /> Add Department
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text placeholder:text-dark-muted/60 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">
          Koi department nahi mila. "Add Department" se naya banayein.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((dept, i) => (
            <motion.div
              key={dept._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Building2 className="text-primary" size={20} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-primary"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(dept)}
                    className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-dark-text">{dept.name}</p>
              <p className="text-xs text-primary mb-2">{dept.code}</p>
              <p className="text-xs text-dark-muted line-clamp-2">{dept.description || 'No description'}</p>
              <span className={`inline-block mt-3 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                dept.status ? 'bg-success/15 text-success' : 'bg-dark-muted/15 text-dark-muted'
              }`}>
                {dept.status ? 'Active' : 'Inactive'}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Add New Department'}
      >
        <DepartmentForm
          initialData={editingDept}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={submitting}
        />
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Department">
        <p className="text-dark-muted text-sm mb-6">
          Kya aap wakai <span className="text-dark-text font-medium">{deleteConfirm?.name}</span> ko delete karna chahte hain? Ye action wapas nahi ho sakta.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm._id)}
            className="px-5 py-2.5 rounded-xl bg-danger hover:bg-danger-dark text-white text-sm font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Departments;