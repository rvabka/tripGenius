'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface TripPlan {
  summary: string;
  transportation: string;
  dailyPlans: Array<{ day: string; activities: string }>;
  accommodation: string;
  localCuisine: string;
  practicalTips: string;
  estimatedBudget: string;
  rawContent: string;
}

export default function TripResults() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const savedPlan = localStorage.getItem('tripPlan');
    if (savedPlan) {
      setTripPlan(JSON.parse(savedPlan));
    }
  }, []);

  console.log(tripPlan)

  const tabs = [
    { id: 'summary', label: 'Podsumowanie' },
    { id: 'daily', label: 'Plan dzienny' },
    { id: 'transport', label: 'Transport' },
    { id: 'accommodation', label: 'Noclegi' },
    { id: 'cuisine', label: 'Kuchnia' },
    { id: 'tips', label: 'Porady' },
    { id: 'budget', label: 'Budżet' }
  ];

  if (!tripPlan) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Ładowanie planu podróży...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">
          Twój plan podróży: {from} → {to}
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Wygenerowano przez TripGenius AI
        </p>
      </div>

      <div className="border-b mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'summary' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Podsumowanie trasy</h2>
            <p className="whitespace-pre-line">{tripPlan.summary}</p>
          </div>
        )}

        {activeTab === 'daily' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Plan dzienny</h2>
            <div className="space-y-6">
              {tripPlan.dailyPlans.map((day, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-lg">{day.day}</h3>
                  <p className="whitespace-pre-line mt-2">{day.activities}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Transport</h2>
            <p className="whitespace-pre-line">{tripPlan.transportation}</p>
          </div>
        )}

        {activeTab === 'accommodation' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Noclegi</h2>
            <p className="whitespace-pre-line">{tripPlan.accommodation}</p>
          </div>
        )}

        {activeTab === 'cuisine' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Lokalna kuchnia</h2>
            <p className="whitespace-pre-line">{tripPlan.localCuisine}</p>
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Porady praktyczne</h2>
            <p className="whitespace-pre-line">{tripPlan.practicalTips}</p>
          </div>
        )}

        {activeTab === 'budget' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Szacowany budżet</h2>
            <p className="whitespace-pre-line">{tripPlan.estimatedBudget}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Link
          href="/trip-planner"
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
        >
          Stwórz nowy plan
        </Link>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Drukuj plan podróży
        </button>
      </div>
    </div>
  );
}