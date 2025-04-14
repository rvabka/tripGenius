import type React from 'react';
interface TripStatsProps {
  title: string;
  value: string;
  label: string;
  icon: React.ReactNode;
}

export function TripStats({ title, value, label, icon }: TripStatsProps) {
  return (
    <div className="rounded-lg bg-[#4a6b4a] p-3">
      <p className="mb-1 text-xs font-medium text-white/80">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/70">{label}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2c3e2e] text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}
