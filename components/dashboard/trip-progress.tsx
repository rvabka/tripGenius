import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { TripPlan } from '@prisma/client';

const TripProgress = ({ trip }: { trip: TripPlan }) => {
  return (
    <div
      key={trip.id}
      className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-all duration-200 ease-in-out group"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full">
        <MapPin className="h-5 w-5 text-customGreen" />
      </div>
      <div className="flex-1">
        <h3 className="text-accentOrange font-semibold">
          {trip.title ? trip.title : trip.to}
        </h3>
        <p className="text-xs text-gray-500 group-hover:text-gray-700">
          {trip.from} → {trip.to}
        </p>
      </div>
      <button className="h-8 w-8 bg-gray-100 rounded-full text-gray-400 group-hover:text-accentOrange group-hover:animate-bounce transition-all duration-200 ease-in-out flex items-center justify-center">
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
};

export default TripProgress;
