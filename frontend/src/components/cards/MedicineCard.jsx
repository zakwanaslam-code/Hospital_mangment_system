import { motion } from 'framer-motion';
import { Pill, AlertTriangle, Calendar, Pencil, Trash2 } from 'lucide-react';

function MedicineCard({ medicine, onEdit, onDelete, delay = 0 }) {
  const isLowStock = medicine.stockQuantity <= medicine.reorderLevel;
  const isExpiringSoon = (new Date(medicine.expiryDate) - Date.now()) / (1000*60*60*24) <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center">
          <Pill className="text-cyan-400" size={20} />
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(medicine)} className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-primary"><Pencil size={14} /></button>
          <button onClick={() => onDelete(medicine)} className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-rose-400"><Trash2 size={14} /></button>
        </div>
      </div>
      <p className="font-semibold text-dark-text text-sm">{medicine.name}</p>
      <p className="text-xs text-dark-muted mb-3">{medicine.genericName || medicine.category}</p>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-dark-muted">Stock</span>
        <span className={isLowStock ? 'text-rose-400 font-semibold' : 'text-dark-text font-semibold'}>
          {medicine.stockQuantity} units
        </span>
      </div>
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-dark-muted">Price</span>
        <span className="text-dark-text font-semibold">Rs. {medicine.unitPrice}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {isLowStock && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-rose-500/15 text-rose-400">
            <AlertTriangle size={10} /> Low Stock
          </span>
        )}
        {isExpiringSoon && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-400">
            <Calendar size={10} /> Expiring Soon
          </span>
        )}
      </div>
    </motion.div>
  );
}
export default MedicineCard;