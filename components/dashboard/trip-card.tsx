'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  MoreVertical,
  Palette,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Trip {
  id: number;
  title: string;
  fromCountry: string;
  toCountry: string;
  duration: string;
  image: string;
  color: string;
  progress: number;
}

interface TripCardProps {
  trip: Trip;
  variant?: 'default' | 'dashboard';
  onColorClick: () => void;
}

export function TripCard({
  trip,
  variant = 'default',
  onColorClick
}: TripCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'daily', label: 'Daily plan' },
    { id: 'transport', label: 'Transport' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'cuisine', label: 'Kitchen' },
    { id: 'tips', label: 'Tips' },
    { id: 'budget', label: 'Budget' }
  ];

  if (variant === 'dashboard') {
    return (
      <div
        className="relative overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-md"
        style={{ backgroundColor: trip.color }}
      >
        <div className="p-5 text-white">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{trip.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Trip Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onColorClick}>
                  <Palette className="mr-2 h-4 w-4" />
                  Change Color
                </DropdownMenuItem>
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

          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {trip.fromCountry} <ArrowRight className="mx-1 inline h-3 w-3" />{' '}
              {trip.toCountry}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{trip.duration}</span>
          </div>

          <div className="mb-1 flex items-center justify-between text-sm">
            <span>Planning progress</span>
            <span className="font-medium">{trip.progress}%</span>
          </div>

          <Button
            className="mt-4 w-full bg-white/20 text-white hover:bg-white/30"
            variant="ghost"
          >
            Continue Planning
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
      style={{ borderTop: `4px solid ${trip.color}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={trip.image || '/placeholder.svg'}
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{trip.title}</h3>
          <div className="flex items-center text-white/90">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="text-sm">
              {trip.fromCountry} <ArrowRight className="mx-1 inline h-3 w-3" />{' '}
              {trip.toCountry}
            </span>
          </div>
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
            <DropdownMenuItem onClick={onColorClick}>
              <Palette className="mr-2 h-4 w-4" />
              Change Color
            </DropdownMenuItem>
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
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="mr-1 h-4 w-4" />
            <span>
              {trip.fromCountry} <ArrowRight className="mx-1 inline h-3 w-3" />{' '}
              {trip.toCountry}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="mr-1 h-4 w-4" />
            <span>{trip.duration}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-600">Trip planning progress</span>
            <span className="font-medium text-[#359572]">{trip.progress}%</span>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-[#4a6b4a] text-[#4a6b4a] hover:bg-[#4a6b4a]/10"
          >
            View Details
          </Button>
          <Button size="sm" className="bg-[#359572] hover:bg-[#2c7a5e]">
            Continue Planning
          </Button>
        </div>
      </div>

      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 flex overflow-x-auto bg-white/90 p-2 shadow-md transition-all">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className="whitespace-nowrap text-xs text-[#2c3e2e] hover:bg-[#4a6b4a]/10 hover:text-[#4a6b4a]"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
