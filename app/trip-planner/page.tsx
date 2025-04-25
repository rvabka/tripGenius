'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '@/components/Loader';
import { toast } from 'sonner';

interface TripPreferences {
  budget: string;
  duration: string;
  interests: string[];
  travelStyle: string;
  transportationType: string;
}

const defaultPreferences: TripPreferences = {
  budget: 'średni',
  duration: '7 dni',
  interests: [],
  travelStyle: 'standardowy',
  transportationType: 'dowolny'
};

export default function TripPlanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  const destinationParam = searchParams.get('destination');

  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] =
    useState<TripPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fromParam) {
      setStartLocation(fromParam);
    }

    if (destinationParam) {
      setDestination(destinationParam);
    }
  }, [fromParam, destinationParam]);

  const popularDestinations = [
    'Paris, France',
    'Barcelona, Spain',
    'Rome, Italy',
    'New York, USA',
    'Tokyo, Japan',
    'Bangkok, Thailand'
  ];

  const handlePreferenceChange = (
    key: keyof TripPreferences,
    value: string | string[]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInterestsChange = (interest: string) => {
    const updatedInterests = [...preferences.interests];

    if (updatedInterests.includes(interest)) {
      const index = updatedInterests.indexOf(interest);
      updatedInterests.splice(index, 1);
    } else {
      updatedInterests.push(interest);
    }

    handlePreferenceChange('interests', updatedInterests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    const isValid = await checkInput(startLocation, destination);
    if (!isValid) return;

    try {
      const response = await fetch('/api/trip-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startLocation,
          destination,
          preferences
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'An error occurred while planning your trip.'
        );
      }

      localStorage.setItem('tripPlan', JSON.stringify(data.tripPlan));

      router.push(
        `/trip-results?from=${encodeURIComponent(
          startLocation
        )}&to=${encodeURIComponent(destination)}`
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Wystąpił nieznany błąd');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectDestination = (dest: string) => {
    setDestination(dest);
  };

  const isValidFormat = (str: string) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+,\s?[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    return regex.test(str);
  };

  const checkInput = async (startLocation: string, destination: string) => {
    if (!isValidFormat(startLocation)) {
      toast('Could not find the start location.🛑');
      setError('Could not find the start location.🛑');
      return false;
    }

    if (!isValidFormat(destination)) {
      toast('Could not find the destination.🛑');
      setError('Could not find the destination.🛑');
      return false;
    }

    const startLocationResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        startLocation
      )}&format=json`
    );
    const destinationResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        destination
      )}&format=json`
    );
    const startLocationData = await startLocationResponse.json();
    const destinationData = await destinationResponse.json();

    if (!startLocationData || startLocationData.length === 0) {
      toast('Could not find the start location.🛑');
      setError('Could not find the start location.🛑');
      return false;
    }

    if (!destinationData || destinationData.length === 0) {
      toast('Could not find the destination.🛑');
      setError('Could not find the destination.🛑');
      return false;
    }

    toast("Great! Let's plan your trip!🚀");
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        <p className="font-light tracking-wider text-3xl">
          trip
          <span className="font-bold tracking-normal text-[#359572] drop-shadow-2xl">
            Genius
          </span>{' '}
          <br />
          <span className="font-medium tracking-normal text-[#2c3e2e]">
            {' '}
            Plan your dream trip🌎
          </span>
        </p>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Starting place
            </label>
            <input
              id="startLocation"
              type="text"
              value={startLocation}
              onChange={e => setStartLocation(e.target.value)}
              placeholder="e.g. Warsaw, Poland"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Purpose of the trip
            </label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Barcelona, ​​Spain"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Popular destinations:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularDestinations.map(dest => (
              <button
                key={dest}
                type="button"
                onClick={() => selectDestination(dest)}
                className="px-3 py-1 bg-accentOrange text-white rounded-full text-sm hover:bg-[#ff8b39] cursor-pointer transition duration-200 ease-in-out"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer
                ${!showAdvanced ? 'text-customGreen' : 'text-red-500'}`}
          >
            {showAdvanced
              ? '− Hide advanced options'
              : '+ Show advanced options'}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                key="advanced-options"
                initial={{
                  opacity: 0,
                  height: 0,
                  transform: 'translateY(-20px)'
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  transform: 'translateY(0px)'
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transform: 'translateY(-20px)'
                }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4 border-t pt-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget
                  </label>
                  <select
                    value={preferences.budget}
                    onChange={e =>
                      handlePreferenceChange('budget', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="niski">Low - Economy travel</option>
                    <option value="średni">Medium - Standard comfort</option>
                    <option value="wysoki">High - Premium travel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={preferences.duration}
                    onChange={e =>
                      handlePreferenceChange('duration', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="weekend">Weekend (2-3 days)</option>
                    <option value="5 dni">Short trip (4-5 days)</option>
                    <option value="7 dni">Week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interests
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      'Culture',
                      'History',
                      'Art',
                      'Nature',
                      'Adventure',
                      'Recreation',
                      'Gastronomy',
                      'Shopping',
                      'Entertainment'
                    ].map(interest => (
                      <label
                        key={interest}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={preferences.interests.includes(interest)}
                          onChange={() => handleInterestsChange(interest)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel style
                  </label>
                  <select
                    value={preferences.travelStyle}
                    onChange={e =>
                      handlePreferenceChange('travelStyle', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="relax">Relaxation and rest</option>
                    <option value="sightseeing">Intensive sightseeing</option>
                    <option value="standard">Balanced</option>
                    <option value="family">Family trip</option>
                    <option value="backpacking">Backpacking</option>
                    <option value="luxurious">Luxurious experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred transport
                  </label>
                  <select
                    value={preferences.transportationType}
                    onChange={e =>
                      handlePreferenceChange(
                        'transportationType',
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="any">Any</option>
                    <option value="plane">Plane</option>
                    <option value="train">Train</option>
                    <option value="car">Car</option>
                    <option value="public transport">Public transport</option>
                    <option value="ecological">Ecological</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-customGreen text-white font-medium rounded-md hover:bg-[#2f8666] disabled:bg-gray-400 w-full md:w-auto cursor-pointer transition-all duration-200"
          >
            {isLoading ? 'Planning a trip...' : 'Plan my trip'}
          </button>
          {isLoading && <Loader addInformation={true} />}
        </div>
      </form>
    </div>
  );
}
