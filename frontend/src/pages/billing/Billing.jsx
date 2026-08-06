import { useState, useEffect, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoiceService } from '../../services/invoiceService.js';
import InvoiceForm from '../../components/forms/InvoiceForm.jsx';
import Modal from '../../components/modals/Modal.jsx';

const STATUS_COLORS = {
  unpaid: 'bg-rose-500/15 text-rose-400',
  partial: 'bg-amber-500/15 text-amber-400',
  paid: 'bg-emerald-500/15 text-emerald-400',
  refunded: 'bg-dark-muted/15 text-dark-muted',
};

function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await invoiceService.getInvoices({ status, limit: 20 });
      setInvoices(res.data);
    } catch (err) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCreateInvoice = async (formData) => {
    setSubmitting(true);
    try {
      await invoiceService.createInvoice(formData);
      toast.success('Invoice created successfully');
      setModalOpen(false);
      fetchInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Billing & Invoices</h1>
          <p className="text-dark-muted text-sm mt-1">{invoices.length} invoices</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors w-fit"
        >
          <Plus size={17} /> Create Invoice
        </button>
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-2">
        {['', 'unpaid', 'partial', 'paid', 'refunded'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
              status === s ? 'bg-primary text-white' : 'bg-dark-bg/60 text-dark-muted border border-white/10'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-96 rounded-2xl" />
      ) : invoices.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">
          Koi invoice nahi mila.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-dark-muted text-xs uppercase">
                  <th className="px-5 py-3 font-medium">Invoice #</th>
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Paid</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-white/[0.05] last:border-0 hover:bg-dark-bg/40">
                    <td className="px-5 py-3 text-dark-text font-medium">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3 text-dark-muted">{inv.patient?.name}</td>
                    <td className="px-5 py-3 text-dark-text">Rs. {inv.totalAmount?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-dark-muted">Rs. {inv.amountPaid?.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${STATUS_COLORS[inv.paymentStatus]}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-dark-muted">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                    <button
  onClick={async () => {
    try {
      await invoiceService.downloadPDF(inv._id, inv.invoiceNumber);
    } catch (err) {
      toast.error('Failed to download invoice');
    }
  }}
  className="p-2 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-primary"
  title="Download PDF"
>
  <Download size={15} />
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Invoice" maxWidth="max-w-2xl">
        <InvoiceForm onSubmit={handleCreateInvoice} onCancel={() => setModalOpen(false)} loading={submitting} />
      </Modal>
    </div>
  );
}

export default Billing;