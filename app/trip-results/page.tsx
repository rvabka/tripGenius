'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import { saveTripPlan } from '../actions/actions';
import { FilePlus, Plus, Printer } from 'lucide-react';

export interface TripPlan {
  externalId: string;
  from: string;
  to: string;
  summary: string;
  transportation: string;
  dailyPlans: string;
  accommodation: string;
  localCuisine: string;
  practicalTips: string;
  estimatedBudget: string;
}

export default function TripResults() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const { user } = useUser();

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const savedPlan = localStorage.getItem('tripPlan');
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      setTripPlan({
        ...parsedPlan,
        externalId: user?.id,
        from: from,
        to: to
      });
    }
  }, [user, from, to]);

  const handleClick = async () => {
    try {
      if (tripPlan !== null) {
        await saveTripPlan(tripPlan);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tripPlan);

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'daily', label: 'Daily plan' },
    { id: 'transport', label: 'Transport' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'cuisine', label: 'Kitchen' },
    { id: 'tips', label: 'Tips' },
    { id: 'budget', label: 'Budget' }
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
          Generate with <span className="font-bold">TripGenius AI</span>
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

      <div className="mt-8 flex justify-center items-center gap-4">
        <Link
          href="/trip-planner"
          className="px-4 py-2 flex items-center justify-center border-2 border-[#1d3557] text-[#1d3557] rounded-md hover:bg-[#1d3557]/10 transition-all duration-300 group"
        >
          <FilePlus className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          Create another trip
        </Link>

        <button
          onClick={handleClick}
          className="px-4 py-2 flex items-center justify-center bg-[#359572] text-white rounded-md hover:bg-[#359572]/90 transition-all duration-300 group cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Add to my account
        </button>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 flex items-center justify-center bg-[#ff6900] text-white rounded-md hover:bg-[#ff6900]/90 transition-all duration-300 group cursor-pointer"
        >
          <Printer className="mr-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
          Print trip plan
        </button>
      </div>
    </div>
  );
}
