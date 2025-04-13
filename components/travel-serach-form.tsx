'use client';

import { useState } from 'react';
import { MapPin, Plane, Search } from 'lucide-react';
import Link from 'next/link';

export default function TravelSearchForm() {
  const [data, setData] = useState({
    from: '',
    to: ''
  });

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
              value={data.from}
              onChange={e => setData({ ...data, from: e.target.value })}
              className="w-full text-sm outline-none placeholder:text-gray-800 text-gray-800 font-medium"
              placeholder="Where are you coming from?"
            />
          </div>
        </div>
        <div className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg">
          <Plane
            className="text-orange-500 mr-3 flex-shrink-0 mt-5 md:mt-0"
            size={20}
          />
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-400 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              value={data.to}
              onChange={e => setData({ ...data, to: e.target.value })}
              className="w-full text-sm outline-none placeholder:text-gray-800 text-gray-800 font-medium"
              placeholder="Where are you going?"
            />
          </div>
        </div>

        <Link
          href={'./trip-planner'}
          className="flex items-center justify-center bg-accentOrange hover:bg-orange-600 transition-colors cursor-pointer text-white rounded-full p-4 w-14 h-14"
        >
          <Search size={25} />
        </Link>
      </form>
    </div>
  );
}
