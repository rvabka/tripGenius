import { Suspense } from 'react';
import SavedTripsWrapper from './saved-trips-wrapper';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedTripsPage() {
  return (
    <Suspense fallback={<SavedTripsSkeleton />}>
      <SavedTripsWrapper />
    </Suspense>
  );
}

function SavedTripsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-20 w-48" />
      <Skeleton className="h-96 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64  w-full" />
        <Skeleton className="h-64  w-full" />
      </div>
    </div>
  );
}
