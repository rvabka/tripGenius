'use server';

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

export async function getTripPlans(userId: string) {
  const trips = await prisma.tripPlan.findMany({
    where: {
      userId: userId
    }
  });

  return trips;
}

export async function markAsCompleted(tripId: string) {
  await prisma.tripPlan.update({
    where: {
      id: tripId
    },
    data: {
      isCompleted: true
    }
  });
}
