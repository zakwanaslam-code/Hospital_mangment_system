import { useState, useEffect, useCallback } from 'react';
import { Plus, UploadCloud, Eye, Printer, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { labService } from '../../services/labService.js';
import LabTestForm from '../../components/forms/LabTestForm.jsx';
import UploadResultModal from '../../components/modals/UploadResultModal.jsx';
import Modal from '../../components/modals/Modal.jsx';

const STATUS_CONFIG = {
  pending: { color: 'bg-warning/15 text-warning', icon: Clock },
  in_progress: { color: 'bg-primary/15 text-primary', icon: Clock },
  completed: { color: 'bg-success/15 text-success', icon: CheckCircle2 },
  cancelled: { color: 'bg-danger/15 text-danger', icon: AlertTriangle },
};

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

function Laboratory() {
  const [tab, setTab] = useState('pending'); // pending | completed
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const status = tab === 'pending' ? 'pending' : 'completed';
      const res = await labService.getLabTests({ status });
      setTests(res.data);
    } catch (err) {
      toast.error('Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleRequestTest = async (formData) => {
    setSubmitting(true);
    try {
      await labService.createLabTest(formData);
      toast.success('Lab test requested successfully');
      setRequestModalOpen(false);
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request test');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async (file) => {
    setSubmitting(true);
    try {
      await labService.uploadResult(uploadTarget._id, file);
      toast.success('Report uploaded successfully');
      setUploadTarget(null);
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload report');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = (fileUrl) => {
    window.open(`${API_BASE}${fileUrl}`, '_blank');
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Laboratory</h1>
          <p className="text-dark-muted text-sm mt-1">Manage lab tests and reports</p>
        </div>
        <button
          onClick={() => setRequestModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors w-fit"
        >
          <Plus size={17} /> Request Test
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-dark-card border border-dark-border w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'pending' ? 'bg-primary text-white' : 'text-dark-muted'
          }`}
        >
          Pending Tests
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'completed' ? 'bg-primary text-white' : 'text-dark-muted'
          }`}
        >
          Completed Reports
        </button>
      </div>

      {/* Test list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : tests.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">
          {tab === 'pending' ? 'Koi pending test nahi hai.' : 'Koi completed report nahi hai.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test, i) => {
            const config = STATUS_CONFIG[test.status] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-dark-text text-sm">{test.testName}</p>
                    <p className="text-xs text-dark-muted mt-0.5">{test.testId}</p>
                  </div>
                  {test.priority === 'urgent' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-danger/15 text-danger">
                      URGENT
                    </span>
                  )}
                </div>

                <p className="text-sm text-dark-text mb-1">{test.patient?.name}</p>
                <p className="text-xs text-dark-muted mb-3 capitalize">{test.testType} test</p>

                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${config.color}`}>
                    <StatusIcon size={11} /> {test.status.replace('_', ' ')}
                  </span>

                  <div className="flex gap-1.5">
                    {test.status === 'completed' ? (
                      <>
                        <button
                          onClick={() => setViewTarget(test)}
                          className="p-2 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-primary"
                          title="View Result"
                        >
                          <Eye size={14} />
                        </button>
                        {test.resultFile && (
                          <button
                            onClick={() => handlePrint(test.resultFile)}
                            className="p-2 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-primary"
                            title="Print Report"
                          >
                            <Printer size={14} />
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => setUploadTarget(test)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25"
                      >
                        <UploadCloud size={13} /> Upload
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Request Test Modal */}
      <Modal isOpen={requestModalOpen} onClose={() => setRequestModalOpen(false)} title="Request Lab Test">
        <LabTestForm onSubmit={handleRequestTest} onCancel={() => setRequestModalOpen(false)} loading={submitting} />
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={!!uploadTarget} onClose={() => setUploadTarget(null)} title={`Upload Result — ${uploadTarget?.testName || ''}`}>
        <UploadResultModal onUpload={handleUpload} onCancel={() => setUploadTarget(null)} loading={submitting} />
      </Modal>

      {/* View Result Modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Test Result">
        {viewTarget && (
          <div className="space-y-4">
            <div>
              <p className="text-dark-text font-semibold">{viewTarget.testName}</p>
              <p className="text-dark-muted text-sm">{viewTarget.patient?.name} — {viewTarget.testId}</p>
            </div>
            {viewTarget.resultSummary && (
              <div className="bg-dark-bg/50 rounded-xl p-4">
                <p className="text-xs text-dark-muted mb-1">Summary</p>
                <p className="text-sm text-dark-text">{viewTarget.resultSummary}</p>
              </div>
            )}
            {viewTarget.resultFile && (
              <button
                onClick={() => handlePrint(viewTarget.resultFile)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-medium w-fit"
              >
                <Printer size={15} /> View / Print Full Report
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Laboratory;