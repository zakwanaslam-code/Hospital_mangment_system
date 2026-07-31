import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-dark-card border border-dark-border rounded-2xl shadow-glass
                        w-full ${maxWidth} max-h-[80vh] flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border shrink-0">
              <h3 className="text-lg font-semibold text-dark-text">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-bg hover:text-dark-text"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;