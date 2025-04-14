'use server';

import { prisma } from '../lib/prisma';
import { TripPlan } from '../trip-results/page';

export async function saveTripPlan(tripPlan: TripPlan) {
  await prisma.tripPlan.create({
    data: {
      userId: tripPlan.userId,
      from: tripPlan.from,
      to: tripPlan.to,
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
