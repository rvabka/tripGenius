'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plane, Plus, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/dashboard/trip-card';
import { TripStats } from '@/components/dashboard/trip-stats';
import { TripChart } from '@/components/dashboard/trip-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { getTripPlans } from '@/app/actions/actions';
import { useUser } from '@clerk/nextjs';
import { TripPlan } from '@/app/trip-results/page';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import TripProgress from './trip-progress';
import Map from '@/components/dashboard/map';

export function UserDashboard() {
  const { user } = useUser();

  const [fetchedTrips, setFetchedTrips] = useState<TripPlan[]>([]);

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

  const calculateCompletedTrips = (): string => {
    return fetchedTrips.filter(trip => trip.isCompleted).length.toString();
  };

  const finishedTrips = fetchedTrips.filter(trip => trip.isCompleted);
  const unFinishedTrips = fetchedTrips.filter(trip => !trip.isCompleted);

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
            <div className="md:col-span-2 col-span-1 space-y-6">
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
                    value={fetchedTrips.length.toString()}
                    label="Planned"
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <TripStats
                    title="Countries"
                    value={fetchedTrips.length.toString()}
                    label="Destinations"
                    icon={<Plane className="h-4 w-4" />}
                  />
                  <TripStats
                    title="Completed"
                    value={calculateCompletedTrips()}
                    label="Trips"
                    icon={<Compass className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Trip Cards */}
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 5000
                  })
                ]}
                opts={{
                  align: 'start',
                  loop: true
                }}
              >
                <CarouselContent>
                  {fetchedTrips.map(trip => (
                    <CarouselItem
                      key={trip.id}
                      className="basis-full md:basis-1/2 shrink-0"
                    >
                      <TripCard key={trip.id} trip={trip} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Right Column - Upcoming Trips */}
            <div className="space-y-6 w-full">
              <div className="rounded-xl bg-white p-5 shadow-sm w-full">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#2c3e2e]">
                    My Trips
                  </h2>
                </div>

                <Tabs defaultValue="activities">
                  <TabsList className="mb-4 grid gap-6 w-full grid-cols-2">
                    <TabsTrigger value="activities">In Progress</TabsTrigger>
                    <TabsTrigger value="details">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="activities"
                    className="overflow-y-auto max-h-[500px]"
                  >
                    {unFinishedTrips.length > 0 ? (
                      unFinishedTrips.map(trip => (
                        <TripProgress key={trip.id} trip={trip} />
                      ))
                    ) : (
                      <div className="rounded-lg bg-gray-50 p-4 text-center">
                        <p className="text-sm text-gray-500">
                          No upcoming trips yet. Plan your next adventure!
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="details"
                    className="overflow-y-auto max-h-[500px]"
                  >
                    {finishedTrips.length > 0 ? (
                      finishedTrips.map(trip => (
                        <TripProgress key={trip.id} trip={trip} />
                      ))
                    ) : (
                      <div className="rounded-lg bg-gray-50 p-4 text-center">
                        <p className="text-sm text-gray-500">
                          No completed trips yet. Start planning your next
                          adventure!
                        </p>
                      </div>
                    )}
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

                <div className="aspect-square rounded-lg shadow-xl">
                  <div className="rounded-lg h-96 w-full overflow-hidden">
                    <Map trip={fetchedTrips} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
