'use client';

import { useEffect, useState } from 'react';
import {
  MapPin,
  Plane,
  Plus,
  ChevronRight,
  Map,
  Compass,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/dashboard/trip-card';
import { TripStats } from '@/components/dashboard/trip-stats';
import { TripProgress } from '@/components/dashboard/trip-progress';
import { TripChart } from '@/components/dashboard/trip-chart';
import { ColorPicker } from '@/components/dashboard/color-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { getTripPlans } from '@/app/actions/actions';
import { useUser } from '@clerk/nextjs';
import { TripPlan } from '@/app/trip-results/page';

const sampleTrips = [
  {
    id: 1,
    title: 'Barcelona Adventure',
    fromCountry: 'Poland',
    toCountry: 'Spain',
    duration: '7 days',
    image: '/placeholder.svg?height=200&width=300',
    color: '#359572', // customGreen
    progress: 85
  },
  {
    id: 2,
    title: 'Tokyo Exploration',
    fromCountry: 'Poland',
    toCountry: 'Japan',
    duration: '10 days',
    image: '/placeholder.svg?height=200&width=300',
    color: '#ff6900', // accentOrange
    progress: 60
  },
  {
    id: 3,
    title: 'New York City Trip',
    fromCountry: 'Poland',
    toCountry: 'USA',
    duration: '7 days',
    image: '/placeholder.svg?height=200&width=300',
    color: '#1d3557', // accentColor
    progress: 30
  }
];

const progressCards = [
  {
    id: 1,
    title: 'Europe Tour',
    icon: <Plane className="h-5 w-5 text-white" />,
    fromCountry: 'Poland',
    toCountry: 'Italy',
    metric: '14 days',
    progress: 45,
    status: 'Planning',
    color: '#359572' // customGreen
  },
  {
    id: 2,
    title: 'Beach Getaway',
    icon: <Compass className="h-5 w-5 text-white" />,
    fromCountry: 'Poland',
    toCountry: 'Greece',
    metric: '7 days',
    progress: 75,
    status: 'Almost Ready',
    color: '#ff6900' // accentOrange
  },
  {
    id: 3,
    title: 'Business Trip',
    icon: <Briefcase className="h-5 w-5 text-white" />,
    fromCountry: 'Poland',
    toCountry: 'Germany',
    metric: '5 days',
    progress: 90,
    status: 'Ready',
    color: '#1d3557' // accentColor
  }
];

export function UserDashboard() {
  const { user } = useUser();

  const [trips, setTrips] = useState(sampleTrips);
  const [fetchedTrips, setFetchedTrips] = useState<TripPlan[]>([]);

  const [selectedTrip, setSelectedTrip] = useState<number | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const handleColorChange = (tripId: number, color: string) => {
    setTrips(
      trips.map(trip => (trip.id === tripId ? { ...trip, color } : trip))
    );
    setColorPickerOpen(false);
  };

  useEffect(() => {
    async function fetchTrips() {
      if (user?.id) {
        try {
          const data = await getTripPlans(user?.id);
          setFetchedTrips(data);
        } catch (error) {
          console.log('error', error);
        }
      }
    }

    fetchTrips();
  }, [user]);

  console.log(fetchedTrips);

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2c3e2e]">Dashboard</h1>
            </div>
            <Link href={'./trip-planner'}>
              <Button className="px-6 py-3 bg-customGreen text-white font-medium rounded-md hover:bg-[#2f8666] disabled:bg-gray-400 w-full md:w-auto cursor-pointer transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Overview */}
            <div className="col-span-2 space-y-6">
              {/* Overview Card */}
              <div className="rounded-xl bg-[#2c3e2e] p-5 text-white">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Overview</h2>
                  <div className="rounded-full bg-[#4a6b4a] px-3 py-1 text-xs">
                    Destinations
                  </div>
                </div>

                <TripChart tripData={fetchedTrips} />

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <TripStats
                    title="Total Trips"
                    value="12"
                    label="Planned"
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <TripStats
                    title="Countries"
                    value="8"
                    label="Destinations"
                    icon={<Plane className="h-4 w-4" />}
                  />
                  <TripStats
                    title="Completed"
                    value="5"
                    label="Trips"
                    icon={<Compass className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Trip Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {trips.slice(0, 2).map(trip => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    variant="dashboard"
                    onColorClick={() => {
                      setSelectedTrip(trip.id);
                      setColorPickerOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Progress Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {progressCards.map(card => (
                  <TripProgress key={card.id} card={card} />
                ))}
              </div>
            </div>

            {/* Right Column - Upcoming Trips */}
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#2c3e2e]">
                    My Trips
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#359572] hover:text-[#2c7a5e]"
                  >
                    View All
                  </Button>
                </div>

                <Tabs defaultValue="activities">
                  <TabsList className="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="activities">In Progress</TabsTrigger>
                    <TabsTrigger value="details">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent value="activities" className="space-y-4">
                    {trips.map(trip => (
                      <div
                        key={trip.id}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: trip.color }}
                        >
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#2c3e2e]">
                            {trip.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {trip.fromCountry} → {trip.toCountry}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-400"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <p className="text-sm text-gray-500">
                        Select a trip to view details
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Live Map */}
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#2c3e2e]">
                    Trip Map
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#359572] hover:text-[#2c7a5e]"
                  >
                    View
                  </Button>
                </div>

                <div className="aspect-square rounded-lg bg-gray-100">
                  <div className="flex h-full items-center justify-center">
                    <Map className="h-12 w-12 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {colorPickerOpen && selectedTrip && (
        <ColorPicker
          isOpen={colorPickerOpen}
          onClose={() => setColorPickerOpen(false)}
          onColorSelect={color => handleColorChange(selectedTrip, color)}
          currentColor={
            trips.find(t => t.id === selectedTrip)?.color || '#359572'
          }
          presetColors={['#2c3e2e', '#4a6b4a', '#1d3557', '#359572', '#ff6900']}
        />
      )}
    </div>
  );
}
