import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 overflow-y-auto">
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
                        w-full ${maxWidth} max-h-[75vh] flex flex-col mb-8`}
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

  // Portal — Modal ko document.body me directly render karta hai,
  // taake koi bhi parent page ka CSS (transform, overflow, animate-fadeIn) ise trap na kar sake
  return createPortal(modalContent, document.body);
}

export default Modal;