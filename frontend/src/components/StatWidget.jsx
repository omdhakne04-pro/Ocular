import React from 'react';

export default function StatWidget({ title, value, subtext, icon: Icon, color = 'cyan' }) {
  const colorMap = {
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      bgIcon: 'bg-cyan-950/60 text-cyan-400',
      textGlow: 'group-hover:text-cyan-400',
      indicator: 'bg-cyan-500',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      bgIcon: 'bg-emerald-950/60 text-emerald-400',
      textGlow: 'group-hover:text-emerald-400',
      indicator: 'bg-emerald-500',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      bgIcon: 'bg-amber-950/60 text-amber-400',
      textGlow: 'group-hover:text-amber-400',
      indicator: 'bg-amber-500',
    },
    crimson: {
      border: 'border-rose-500/30 hover:border-rose-500/60',
      bgIcon: 'bg-rose-950/60 text-rose-400',
      textGlow: 'group-hover:text-rose-400',
      indicator: 'bg-rose-500',
    },
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md border ${scheme.border} p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-extrabold tracking-tight text-white ${scheme.textGlow} transition-colors font-mono`}>
            {value}
          </p>
          {subtext && (
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${scheme.indicator}`}></span>
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl border border-white/5 ${scheme.bgIcon} shadow-inner`}>
          {Icon && <Icon className="w-6 h-6 stroke-[2.2]" />}
        </div>
      </div>
      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${scheme.indicator} opacity-20 group-hover:opacity-100 transition-opacity`} />
    </div>
  );
}
