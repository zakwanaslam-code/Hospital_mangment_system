import { TrendingUp } from 'lucide-react';
import { Building2, HeartPulse, Bone, Baby, Brain, Stethoscope } from 'lucide-react';

const ICON_CYCLE = [Stethoscope, HeartPulse, Baby, Bone, Brain, Building2];
const COLOR_CYCLE = [
  { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  { bg: 'bg-rose-500/15', text: 'text-rose-400' },
  { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
];

function DepartmentMiniCard({ dept, index }) {
  const Icon = ICON_CYCLE[index % ICON_CYCLE.length];
  const color = COLOR_CYCLE[index % COLOR_CYCLE.length];

  return (
    <div className="glass-card p-4 text-center hover:-translate-y-0.5 transition-transform cursor-pointer">
      <div className={`w-11 h-11 mx-auto rounded-xl ${color.bg} flex items-center justify-center mb-2.5`}>
        <Icon className={color.text} size={20} />
      </div>
      <p className="text-sm font-semibold text-dark-text truncate">{dept.name}</p>
      <p className="text-xs text-dark-muted mt-0.5">{dept.patientCount} Patients</p>
      <p className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1 mt-1.5">
        <TrendingUp size={11} /> {dept.growth}%
      </p>
    </div>
  );
}

export default DepartmentMiniCard;