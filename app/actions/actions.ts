'use server';

import { revalidatePath, unstable_cache } from 'next/cache';
import { prisma } from '../lib/prisma';
import { TripPlan } from '../trip-results/page';

export async function saveTripPlan(tripPlan: TripPlan) {
  const existingTrip = await prisma.tripPlan.findFirst({
    where: {
      id: tripPlan.id,
      image: tripPlan.image,
      userId: tripPlan.userId
    }
  });

  if (existingTrip) {
    throw new Error('Trip plan already exists!');
  }

  await prisma.tripPlan.create({
    data: {
      userId: tripPlan.userId,
      from: tripPlan.from,
      to: tripPlan.to,
      image: tripPlan.image,
      duration: tripPlan.duration,
      transportType: tripPlan.transportType,
      title: tripPlan.title,
      longitude: tripPlan.longitude,
      latitude: tripPlan.latitude,
      summary: tripPlan.summary,
      transportation: tripPlan.transportation,
      dailyPlans: tripPlan.dailyPlans,
      accommodation: tripPlan.accommodation,
      localCuisine: tripPlan.localCuisine,
      practicalTips: tripPlan.practicalTips,
      estimatedBudget: tripPlan.estimatedBudget
    }
  });
}

export const getTripPlans = unstable_cache(
  async (userId: string) => {
    const trips = await prisma.tripPlan.findMany({
      where: {
        userId: userId
      }
    });

    return trips;
  },
  ['trip-plans'],
  { revalidate: false }
);

export async function markAsCompleted(tripId: string) {
  await prisma.tripPlan.update({
    where: {
      id: tripId
    },
    data: {
      isCompleted: true
    }
  });

  revalidatePath('/saved-trips');
}

export async function deleteTripPlan(tripId: string) {
  await prisma.tripPlan.delete({
    where: {
      id: tripId
    }
  });

  revalidatePath('/saved-trips');
}