'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';
import { toast } from 'sonner';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { saveTripPlan, updateTripPlan } from '../actions/actions';
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
  Leaf,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface TripViewEditProps {
  initialTripPlan?: TripPlan;
  onSave?: (tripPlan: TripPlan) => Promise<void>;
}

export default function TripViewEdit({
  initialTripPlan,
  onSave
}: TripViewEditProps) {
  const searchParams = useSearchParams();
  const { user } = useUser();

  const fromParam = searchParams.get('from') || '';
  const toParam = searchParams.get('to') || '';
  const isEditMode = searchParams.get('edit') === 'true';

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [isAdded, setIsAdded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(isEditMode);

  useEffect(() => {
    if (initialTripPlan) {
      setTripPlan(initialTripPlan);
    } else {
      const savedPlan = localStorage.getItem('tripPlan');
      if (savedPlan) {
        const parsedPlan = JSON.parse(savedPlan);
        setTripPlan({
          ...parsedPlan,
          userId: user?.id,
          from: fromParam || parsedPlan.from,
          to: toParam || parsedPlan.to,
          image: parsedPlan.image || '',
          duration: parsedPlan.duration || '',
          transportType: parsedPlan.transportType || '',
          title: parsedPlan.title || '',
          longitude: parsedPlan.longitude || 0,
          latitude: parsedPlan.latitude || 0
        });
      }
    }
  }, [initialTripPlan, user, fromParam, toParam]);

  console.log('Trip Plan:', tripPlan);

  const handleSaveToDashboard = async () => {
    if (isSaving || isAdded || !tripPlan) return;

    setIsSaving(true);
    try {
      await saveTripPlan(tripPlan);
      setIsAdded(true);
      toast('Trip has been added to your Dashboard☺️');
    } catch (error) {
      console.log(error);
      setIsAdded(true);
      toast('Trip is already in your Dashboard!🛑');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!tripPlan) return;

    setIsSaving(true);
    try {
      updateTripPlan(tripPlan.id, tripPlan);
      localStorage.setItem('tripPlan', JSON.stringify(tripPlan));

      if (onSave) {
        await onSave(tripPlan);
      }

      toast('Trip plan saved successfully!☺️');
      setEditing(false);
    } catch (error) {
      toast('Failed to save trip plan. Please try again.🛑');
      console.error('Error saving trip plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof TripPlan, value: string | number) => {
    if (!tripPlan) return;
    setTripPlan({ ...tripPlan, [field]: value });
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customGreen mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie planu podróży...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Edit/Save toggle button */}
      {user?.id && (
        <div className="flex justify-end">
          {editing ? (
            <div className="flex gap-2">
              <Button
                onClick={() => setEditing(false)}
                className="px-6 py-3 text-white bg-red-700 font-medium rounded-md hover:bg-red-800 disabled:bg-gray-400 w-full md:w-auto cursor-pointer transition-all duration-200"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-6 py-3 bg-customGreen text-white font-medium rounded-md hover:bg-[#2f8666] disabled:bg-gray-400 w-full md:w-auto cursor-pointer transition-all duration-200"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-customGreen text-white font-medium rounded-md hover:bg-[#2f8666] disabled:bg-gray-400 w-full md:w-auto cursor-pointer transition-all duration-200"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Trip
            </Button>
          )}
        </div>
      )}

      {/* Hero section with image */}
      <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px] shadow-xl">
        <Image
          src={tripPlan.image || '/placeholder.svg?height=400&width=1200'}
          alt={`${tripPlan.from} to ${tripPlan.to} trip`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-white/80" />
            <div className="flex items-center text-xl md:text-2xl">
              <span className="font-medium text-white/90">{tripPlan.from}</span>
              <span className="mx-2">→</span>
              <span className="font-medium text-white/90">{tripPlan.to}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {tripPlan.title || 'Twój plan podróży'}
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
                <span className="ml-1">
                  {tripPlan.transportType.toLocaleUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content tabs */}
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
          {editing && (
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer rounded-xl ${
                activeTab === 'general'
                  ? 'bg-customGreen text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Ogólne informacje
            </button>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'summary' &&
            (editing ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Podsumowanie podróży</h2>
                <MDEditor
                  value={tripPlan.summary}
                  onChange={value => handleInputChange('summary', value || '')}
                  height={500}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none mx-auto text-center">
                <div className="text-center mx-auto max-w-3xl">
                  <ReactMarkdown>{tripPlan.summary}</ReactMarkdown>
                </div>
              </div>
            ))}

          {activeTab === 'daily' &&
            (editing ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Plan dzienny</h2>
                <MDEditor
                  value={tripPlan.dailyPlans}
                  onChange={value =>
                    handleInputChange('dailyPlans', value || '')
                  }
                  height={500}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none mx-auto text-center">
                <div className="text-left mx-auto max-w-3xl">
                  <ReactMarkdown>{tripPlan.dailyPlans}</ReactMarkdown>
                </div>
              </div>
            ))}

          {activeTab === 'transport' &&
            (editing ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Transport</h2>
                <MDEditor
                  value={tripPlan.transportation}
                  onChange={value =>
                    handleInputChange('transportation', value || '')
                  }
                  height={500}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none mx-auto text-center">
                <div className="text-left mx-auto max-w-3xl">
                  <ReactMarkdown>{tripPlan.transportation}</ReactMarkdown>
                </div>
              </div>
            ))}

          {activeTab === 'accommodation' &&
            (editing ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Noclegi</h2>
                <MDEditor
                  value={tripPlan.accommodation}
                  onChange={value =>
                    handleInputChange('accommodation', value || '')
                  }
                  height={500}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none mx-auto text-center">
                <div className="text-left mx-auto max-w-3xl">
                  <ReactMarkdown>{tripPlan.accommodation}</ReactMarkdown>
                </div>
              </div>
            ))}

          {activeTab === 'cuisine' &&
            (editing ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Kuchnia lokalna</h2>
                <MDEditor
                  value={tripPlan.localCuisine}
                  onChange={value =>
                    handleInputChange('localCuisine', value || '')
                  }
                  height={500}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none mx-auto text-center">
                <div className="text-left mx-auto max-w-3xl">
                  <ReactMarkdown>{tripPlan.localCuisine}</ReactMarkdown>
                </div>
              </div>
            ))}

          {activeTab === 'tips' &&
            (editing ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Praktyczne porady</h2>
                <MDEditor
                  value={tripPlan.practicalTips}
                  onChange={value =>
                    handleInputChange('practicalTips', value || '')
                  }
                  height={500}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none mx-auto text-center">
                <div className="text-left mx-auto max-w-3xl">
                  <ReactMarkdown>{tripPlan.practicalTips}</ReactMarkdown>
                </div>
              </div>
            ))}

          {activeTab === 'budget' &&
            (editing ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Szacowany budżet</h2>
                <MDEditor
                  value={tripPlan.estimatedBudget}
                  onChange={value =>
                    handleInputChange('estimatedBudget', value || '')
                  }
                  height={500}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none mx-auto text-center">
                <div className="text-left mx-auto max-w-3xl">
                  <ReactMarkdown>{tripPlan.estimatedBudget}</ReactMarkdown>
                </div>
              </div>
            ))}

          {activeTab === 'general' && editing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Podstawowe informacje</h3>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      URL obrazu
                    </label>
                    <input
                      type="text"
                      value={tripPlan.image || ''}
                      onChange={e => handleInputChange('image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Lokalizacja</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Długość geograficzna
                      </label>
                      <input
                        type="number"
                        value={tripPlan.longitude || 0}
                        onChange={e =>
                          handleInputChange(
                            'longitude',
                            Number.parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen"
                        step="0.000001"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Szerokość geograficzna
                      </label>
                      <input
                        type="number"
                        value={tripPlan.latitude || 0}
                        onChange={e =>
                          handleInputChange(
                            'latitude',
                            Number.parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-customGreen focus:border-customGreen"
                        step="0.000001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons - only show in view mode */}
      {!editing && (
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
              onClick={handleSaveToDashboard}
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
            <button className="px-5 py-2.5 flex items-center justify-center bg-[#ff6900] disabled:bg-gray-400 text-white rounded-lg hover:bg-[#ff6900]/90 transition-all duration-300 group cursor-pointer font-medium shadow-md">
              <Link href="/sign-in">Log in to add trip to your account</Link>{' '}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
