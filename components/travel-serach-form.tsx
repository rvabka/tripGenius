'use client';

import { useState } from 'react';
import { Calendar, MapPin, Search } from 'lucide-react';
// import { format } from 'date-fns';

export default function TravelSearchForm() {
  const [location, setLocation] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  //   const formatDisplayDate = (dateString: string) => {
  //     if (!dateString) return '';
  //     const date = new Date(dateString);
  //     return format(date, 'dd MMM yyyy');
  //   };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form className="flex flex-col bg-white rounded-xl shadow-lg p-4 md:p-6 justify-center items-center gap-4">
        {/* Location Field - Now at the top */}
        <div className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg">
          <MapPin
            className="text-orange-500 mr-3 flex-shrink-0 mt-5 md:mt-0"
            size={20}
          />
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-400 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full text-sm outline-none placeholder:text-gray-800 text-gray-800 font-medium"
              placeholder="Where are you going?"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="relative flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg">
            <Calendar
              className="text-orange-500 mr-3 flex-shrink-0 pointer-events-none mt-5 md:mt-0"
              size={20}
            />
            <div className="flex flex-col w-full relative">
              <label className="text-sm text-gray-400 font-medium mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={departDate}
                onChange={e => setDepartDate(e.target.value)}
                className="w-full text-sm outline-none text-gray-800 font-medium text-center cursor-pointer appearance-none"
              />
            </div>
          </div>

          <div className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg">
            <Calendar
              className="text-orange-500 mr-3 flex-shrink-0 mt-5 md:mt-0"
              size={20}
            />
            <div className="flex flex-col w-full relative">
              <label className="text-sm text-gray-400 font-medium mb-1">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                className="w-full text-sm outline-none text-gray-800 font-medium cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer text-white rounded-full p-4 w-14 h-14">
          <Search size={25} />
        </button>
      </form>
    </div>
  );
}
