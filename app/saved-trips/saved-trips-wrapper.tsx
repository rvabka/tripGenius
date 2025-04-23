'use server';

import { getTripPlans } from '@/app/actions/actions';
import { currentUser } from '@clerk/nextjs/server';
import { UserDashboard } from './saved-trips-client';

export default async function SavedTripsWrapper() {
  const user = await currentUser();

  if (!user) return <div>Unauthorized</div>;

  const trips = await getTripPlans(user.id);

  return <UserDashboard fetchedTrips={trips} />;
}
