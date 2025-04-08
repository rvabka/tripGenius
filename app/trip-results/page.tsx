'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Loader from '@/components/Loader';

interface TripPlan {
  summary: string;
  transportation: string;
  dailyPlans: string;
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

  console.log(tripPlan);

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
      <Loader addInformation={false} addText={'Ładowanie planu podróży...'} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="flex flex-col text-3xl font-bold text-center gap-2">
          Twój plan podróży:
          <div>
            <span className="font-light text-accentOrange">{from}</span> →{' '}
            <span className="font-light text-accentOrange">{to}</span>
          </div>
        </h1>
        <p className="text-center text-gray-600 mt-3">
          Wygenerowano przez TripGenius AI
        </p>
      </div>

      <div className="flex justify-center items-center border-b mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
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

      <div className="flex justify-center items-center bg-white rounded-lg shadow-md p-6">
        {activeTab === 'summary' && (
          <div className="prose">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Podsumowanie trasy
            </h2>
            <ReactMarkdown>{tripPlan.summary}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="prose">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Plan dzienny
            </h2>
            <ReactMarkdown>{tripPlan.dailyPlans}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="prose">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Transport
            </h2>
            <ReactMarkdown>{tripPlan.transportation}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'accommodation' && (
          <div className="prose">
            <h2 className="text-2xl font-semibold mb-4 text-center">Noclegi</h2>
            <ReactMarkdown>{tripPlan.accommodation}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'cuisine' && (
          <div className="prose">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Lokalna kuchnia
            </h2>
            <ReactMarkdown>{tripPlan.localCuisine}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="prose">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Porady praktyczne
            </h2>
            <ReactMarkdown>{tripPlan.practicalTips}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="prose">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Szacowany budżet
            </h2>
            <ReactMarkdown>{tripPlan.estimatedBudget}</ReactMarkdown>
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
