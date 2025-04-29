'use client';
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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function TripCard({
  trip,
  handleTripCompleted,
  handleTripDeleted
}: {
  trip: TripPlan;
  handleTripCompleted: () => void;
  handleTripDeleted: () => void;
}) {
  const router = useRouter();

  const handleShareTrip = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://trip-genius-9tp9.vercel.app/trip-results?from=${encodeURIComponent(
          trip.from
        )}&to=${encodeURIComponent(trip.to)}`
      );
      toast('Trip link copied to clipboard!👍');
    } catch (error) {
      toast('Error sharing trip link!👎');
      console.error('Error sharing trip:', error);
    }
  };

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${trip.latitude},${trip.longitude}`;
    window.open(url, '_blank');
  };

  const handleEditTrip = () => {
    localStorage.clear();
    localStorage.setItem('tripPlan', JSON.stringify(trip));
    router.push(
      `https://trip-genius-9tp9.vercel.app/trip-results?from=${encodeURIComponent(
        trip.from
      )}&to=${encodeURIComponent(trip.to)}&edit=true`
    );
  };

  return (
    <div className="block group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg select-none">
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
          <DropdownMenuContent
            align="end"
            className="absolute right-2 top-2 z-10"
          >
            <DropdownMenuLabel>Trip Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEditTrip}>
              Edit Trip
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareTrip}>
              Copy Trip Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenMaps}>
              Open in Maps
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={handleTripDeleted}
            >
              Delete Trip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-col items-center justify-between gap-3 text-base">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="mr-2 h-4 w-4 text-customGreen" />
            <span className="font-medium">
              {trip.from}
              <ArrowRight className="mx-2 inline size-3.5 text-customGreen" />
              {trip.to}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="mr-2 h-4 w-4 text-customGreen" />
            <span className="font-medium">{trip.duration}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between gap-2">
            <Button
              disabled={trip.isCompleted}
              onClick={handleTripCompleted}
              size="sm"
              className="bg-customGreen hover:bg-[#2c7a5e] disabled:cursor-not-allowed cursor-pointer disabled:bg-gray-400 w-[49%]"
            >
              {trip.isCompleted ? 'Completed' : 'Mark as Completed'}
            </Button>

            <Button
              size="sm"
              className="bg-accentOrange hover:bg-[#ff5e00] disabled:cursor-not-allowed cursor-pointer disabled:bg-gray-400 w-[49%]"
            >
              <Link
                href={`https://trip-genius-9tp9.vercel.app/trip-results?from=${encodeURIComponent(
                  trip.from
                )}&to=${encodeURIComponent(trip.to)}`}
              >
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
