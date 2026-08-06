import { useState, useEffect, useRef } from 'react';
import { Loader2, Search, ChevronDown, Check } from 'lucide-react';
import { patientService } from '../../services/patientService.js';

const inputClass = 'w-full px-3.5 py-2.5 rounded-xl bg-dark-bg/60 border border-dark-border text-dark-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';
const labelClass = 'text-xs font-medium text-dark-muted mb-1.5 block';

function AssignBedModal({ bedNumber, onAssign, onCancel, loading }) {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    patientService.getPatients({ limit: 200 }).then((res) => setPatients(res.data || []));
  }, []);

  // Bahar click karne par dropdown band ho jaye
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPatients = patients.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q) || p.phone?.includes(q);
  });

  const handleSelect = (patient) => {
    setSelected(patient);
    setSearch('');
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected) onAssign(selected._id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-dark-muted">
        Select a patient for Bed <span className="text-primary font-semibold">{bedNumber}</span>
      </p>

      <div ref={wrapperRef} className="relative">
        <label className={labelClass}>Patient *</label>

        {/* Selected value / trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`${inputClass} flex items-center justify-between text-left`}
        >
          <span className={selected ? 'text-dark-text' : 'text-dark-muted/60'}>
            {selected ? `${selected.name} (${selected.patientId})` : 'Search and select patient'}
          </span>
          <ChevronDown size={16} className={`text-dark-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-10 mt-1.5 w-full bg-dark-card border border-dark-border rounded-xl shadow-glass overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-dark-border sticky top-0 bg-dark-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={14} />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type name, ID, or phone..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-dark-bg/60 border border-dark-border
                             text-sm text-dark-text placeholder:text-dark-muted/60 outline-none
                             focus:border-primary"
                />
              </div>
            </div>

            {/* Results list */}
            <div className="max-h-52 overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <p className="px-4 py-4 text-sm text-dark-muted text-center">No patient found</p>
              ) : (
                filteredPatients.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => handleSelect(p)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                               hover:bg-primary/10 transition-colors"
                  >
                    <div>
                      <p className="text-dark-text font-medium">{p.name}</p>
                      <p className="text-xs text-dark-muted">{p.patientId} • {p.phone}</p>
                    </div>
                    {selected?._id === p._id && <Check size={15} className="text-primary shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!selected || loading}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin" size={15} />}
          Assign Bed
        </button>
      </div>
    </form>
  );
}

export default AssignBedModal;