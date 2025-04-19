'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import { saveTripPlan } from '../actions/actions';
import {
  FilePlus,
  Plus,
  Printer,
  MapPin,
  Calendar,
  Plane,
  Car,
  Train,
  Bus,
  Leaf
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export interface TripPlan {
  id: string;
  userId: string;
  from: string;
  to: string;
  summary: string;
  transportation: string;
  dailyPlans: string;
  accommodation: string;
  localCuisine: string;
  practicalTips: string;
  estimatedBudget: string;
  image: string;
  duration: string;
  transportType: string;
  isCompleted: boolean;
  title: string;
  longitude: number;
  latitude: number;
}

export default function TripResults() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const { user } = useUser();

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [isAdded, setIsAdded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('tripPlan');
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      console.log(parsedPlan.image);
      setTripPlan({
        ...parsedPlan,
        userId: user?.id,
        from: from,
        to: to,
        image: parsedPlan.image || '',
        duration: parsedPlan.duration || '',
        transportType: parsedPlan.transportType || '',
        title: parsedPlan.title || '',
        longitude: parsedPlan.longitude || 0,
        latitude: parsedPlan.latitude || 0
      });
    }
  }, [user, from, to]);

  console.log('Trip Plan:', tripPlan);

  const handleClick = async () => {
    if (isSaving || isAdded) return;

    setIsSaving(true);
    try {
      if (tripPlan !== null) {
        await saveTripPlan(tripPlan);
        setIsAdded(true);
        toast('Trip has been added to your Dashboard☺️');
      }
    } catch (error) {
      console.log(error);
      setIsAdded(true);
      toast('Trip is already in your Dashboard!🛑');
    } finally {
      setIsSaving(false);
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'plane':
        return <Plane className="h-5 w-5" />;
      case 'car':
        return <Car className="h-5 w-5" />;
      case 'train':
        return <Train className="h-5 w-5" />;
      case 'public transport':
        return <Bus className="h-5 w-5" />;
      case 'ecological':
        return <Leaf className="h-5 w-5" />;
      case 'any':
      default:
        return <Plane className="h-5 w-5" />;
    }
  };

  const tabs = [
    { id: 'summary', label: 'Podsumowanie' },
    { id: 'transport', label: 'Transport' },
    { id: 'daily', label: 'Plan dzienny' },
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Hero section with image */}
      <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px] shadow-xl">
        {tripPlan.image ? (
          <Image
            src={tripPlan.image || '/placeholder.svg'}
            alt={`${from} to ${to} trip`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Trip placeholder"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-white/80" />
            <div className="flex items-center text-xl md:text-2xl">
              <span className="font-medium text-white/90">{from}</span>
              <span className="mx-2">→</span>
              <span className="font-medium text-white/90">{to}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Twój plan podróży
          </h1>

          <div className="flex flex-wrap gap-3 mt-2">
            {tripPlan.duration && (
              <div className="bg-white/10 text-white border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {tripPlan.duration}
              </div>
            )}
            {tripPlan.transportType && (
              <div className="bg-white/10 text-white border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-sm">
                {getTransportIcon(tripPlan.transportType)}
                <span className="ml-1">{tripPlan.transportType}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex md:justify-center md:items-center overflow-x-auto border-b py-2 gap-0 md:gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer rounded-xl ${
                activeTab === tab.id
                  ? 'bg-customGreen text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'summary' && (
            <div className="prose prose-slate max-w-none mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Podsumowanie trasy
              </h2>
              <div className="text-center mx-auto max-w-3xl">
                <ReactMarkdown>{tripPlan.summary}</ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="prose prose-slate max-w-none mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Plan dzienny</h2>
              <div className="text-left mx-auto max-w-3xl ">
                <ReactMarkdown>{tripPlan.dailyPlans}</ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'transport' && (
            <div className="prose prose-slate max-w-none mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Transport</h2>
              <div className="text-left mx-auto max-w-3xl">
                <ReactMarkdown>{tripPlan.transportation}</ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'accommodation' && (
            <div className="prose prose-slate max-w-none mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Noclegi</h2>
              <div className="text-left mx-auto max-w-3xl">
                <ReactMarkdown>{tripPlan.accommodation}</ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'cuisine' && (
            <div className="prose prose-slate max-w-none mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Lokalna kuchnia</h2>
              <div className="text-left mx-auto max-w-3xl">
                <ReactMarkdown>{tripPlan.localCuisine}</ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="prose prose-slate max-w-none mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Porady praktyczne</h2>
              <div className="text-left mx-auto max-w-3xl">
                <ReactMarkdown>{tripPlan.practicalTips}</ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="prose prose-slate max-w-none mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Szacowany budżet</h2>
              <div className="text-left mx-auto max-w-3xl">
                <ReactMarkdown>{tripPlan.estimatedBudget}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        <Link
          href="/trip-planner"
          className="px-5 py-2.5 flex items-center justify-center border-2 border-[#1d3557] text-[#1d3557] rounded-lg hover:bg-[#1d3557]/10 transition-all duration-300 group font-medium"
        >
          <FilePlus className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          Create another trip
        </Link>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 flex items-center justify-center bg-[#ff6900] text-white rounded-lg hover:bg-[#ff6900]/90 transition-all duration-300 group cursor-pointer font-medium shadow-md"
        >
          <Printer className="mr-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          Print trip plan
        </button>

        {user?.id ? (
          <button
            onClick={handleClick}
            disabled={isSaving || isAdded}
            className={`px-5 py-2.5 flex items-center justify-center ${
              isAdded ? 'bg-gray-400 cursor-not-allowed' : 'bg-customGreen'
            } ${
              isSaving && 'cursor-progress'
            } text-white rounded-lg transition-all duration-300 font-medium shadow-md cursor-pointer`}
          >
            <Plus className="mr-2 h-5 w-5" />
            {isAdded
              ? 'Trip already saved'
              : isSaving
              ? 'Saving...'
              : 'Save trip'}
          </button>
        ) : (
          <button className="px-5 py-2.5 flex items-center justify-center bg-[#ff6900] text-white rounded-lg hover:bg-[#ff6900]/90 transition-all duration-300 group cursor-pointer font-medium shadow-md">
            <Link href="/sign-in">Log in to add trip to your account</Link>{' '}
          </button>
        )}
      </div>
    </div>
  );
}
