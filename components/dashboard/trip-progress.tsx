import type React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProgressCard {
  id: number;
  title: string;
  icon: React.ReactNode;
  fromCountry: string;
  toCountry: string;
  metric: string;
  progress: number;
  status: string;
  color: string;
}

interface TripProgressProps {
  card: ProgressCard;
}

export function TripProgress({ card }: TripProgressProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: card.color }}
        >
          {card.icon}
        </div>
        <h3 className="font-medium text-[#2c3e2e]">{card.title}</h3>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="text-gray-600">
          <span>
            {card.fromCountry} <ArrowRight className="mx-1 inline h-3 w-3" />{' '}
            {card.toCountry}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-[#2c3e2e]">{card.progress}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="rounded-full bg-green-100 px-2 py-1 text-green-700">
          {card.status}
        </div>
        <div className="text-gray-500">{card.metric}</div>
      </div>
    </div>
  );
}
