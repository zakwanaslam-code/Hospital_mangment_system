import { useNavigate } from 'react-router-dom';
import { Phone, Trash2 } from 'lucide-react';

const STATUS_COLORS = {
  active: 'bg-success/15 text-success',
  inactive: 'bg-dark-muted/15 text-dark-muted',
  admitted: 'bg-warning/15 text-warning',
  discharged: 'bg-primary/15 text-primary',
};

function PatientTable({ patients, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border text-left text-dark-muted text-xs uppercase">
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Gender</th>
              <th className="px-5 py-3 font-medium">Blood Group</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p._id}
                onClick={() => navigate(`/patients/${p._id}`)}
                className="border-b border-dark-border/40 last:border-0 hover:bg-dark-bg/40 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold">
                      {p.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">{p.name}</p>
                      <p className="text-xs text-dark-muted">{p.patientId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-dark-muted">
                  <span className="flex items-center gap-1.5"><Phone size={12} /> {p.phone}</span>
                </td>
                <td className="px-5 py-3 text-dark-muted capitalize">{p.gender}</td>
                <td className="px-5 py-3 text-dark-muted">{p.bloodGroup}</td>
                <td className="px-5 py-3 text-dark-muted">{p.department?.name || '—'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${STATUS_COLORS[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(p);
                    }}
                    className="p-1.5 rounded-lg text-dark-muted hover:bg-danger/10 hover:text-danger"
                    title="Remove Patient"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientTable;