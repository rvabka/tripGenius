'use client';
import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {} from '@/components/ui/carousel';
import { TripPlan } from '@/app/trip-results/page';
import { markAsCompleted } from '@/app/actions/actions';
import { toast } from 'sonner';

export function TripCard({ trip }: { trip: TripPlan }) {
  const [isCompleted, setIsCompleted] = useState(trip.isCompleted || false);

  const handleClick = async () => {
    try {
      if (trip !== null) {
        await markAsCompleted(trip.id);
        setIsCompleted(true);
        toast('Trip marked as completed!👍');
      }
    } catch (error) {
      console.error('Error marking trip as completed:', error);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg select-none">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={trip.image || '/placeholder.svg'}
          alt={trip.to}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{trip.to}</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 text-[#2c3e2e] hover:bg-white"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Trip Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Trip</DropdownMenuItem>
            <DropdownMenuItem>Share Trip</DropdownMenuItem>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Delete Trip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-col items-center justify-between gap-3 text-base">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="mr-2 h-4 w-4 text-[#359572]" />
            <span className="font-medium">
              {trip.from}
              <ArrowRight className="mx-2 inline size-3.5 text-[#359572]" />
              {trip.to}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="mr-2 h-4 w-4 text-[#359572]" />
            <span className="font-medium">{trip.duration}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#4a6b4a] text-[#4a6b4a] hover:bg-[#4a6b4a]/10 cursor-pointer"
          >
            Add to Calendar
          </Button>
          <Button
            disabled={isCompleted}
            onClick={handleClick}
            size="sm"
            className="bg-[#359572] hover:bg-[#2c7a5e] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isCompleted ? 'Completed' : 'Mark as Completed'}
          </Button>
        </div>
      </div>
    </div>
  );
}
