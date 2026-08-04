import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Boxes, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { inventoryService } from '../../services/inventoryService.js';
import InventoryForm from '../../components/forms/InventoryForm.jsx';
import Modal from '../../components/modals/Modal.jsx';

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryService.getItems({ search });
      setItems(res.data);
    } catch (err) { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { const t = setTimeout(fetchItems, 300); return () => clearTimeout(t); }, [fetchItems]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) { await inventoryService.updateItem(editing._id, data); toast.success('Item updated'); }
      else { await inventoryService.createItem(data); toast.success('Item added'); }
      setModalOpen(false); setEditing(null); fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try { await inventoryService.deleteItem(id); toast.success('Item deleted'); setDeleteTarget(null); fetchItems(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-dark-text">Inventory</h1><p className="text-dark-muted text-sm mt-1">{items.length} items tracked</p></div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow w-fit"><Plus size={17} /> Add Item</button>
      </div>

      <div className="glass-card p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-bg/60 border border-white/10 text-dark-text text-sm outline-none focus:border-primary" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-muted text-sm">Koi item nahi mila.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.03 }} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center"><Boxes className="text-orange-400" size={20} /></div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(item); setModalOpen(true); }} className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-primary"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-rose-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="font-semibold text-dark-text text-sm">{item.itemName}</p>
              <p className="text-xs text-dark-muted mb-3 capitalize">{item.category} • {item.location || 'No location'}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-muted text-xs">Quantity</span>
                <span className={item.isLowStock ? 'text-rose-400 font-semibold' : 'text-dark-text font-semibold'}>{item.quantity} {item.unit}</span>
              </div>
              {item.isLowStock && (
                <span className="flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-[10px] font-medium bg-rose-500/15 text-rose-400 w-fit"><AlertTriangle size={10} /> Low Stock</span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Item' : 'Add Item'}>
        <InventoryForm initialData={editing} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditing(null); }} loading={submitting} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item">
        <p className="text-dark-muted text-sm mb-6">Delete <span className="text-dark-text font-medium">{deleteTarget?.itemName}</span>?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg">Cancel</button>
          <button onClick={() => handleDelete(deleteTarget._id)} className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
export default Inventory;