import { Spinner } from '@/components/loading-spinner';
import React from 'react';

const Welcome = () => {
    
  return (
    <div className="flex flex-col w-full flex-1 h-[75vh] justify-center items-center px-4 gap-3">
      <Spinner />
      <p className="text-2xl font-bold text-[#4a6b4a]">
        Creating your account...
      </p>
      <p className="text-2xl font-light text-[#4a6b4a]">
        Just a moment while we set things up for you
      </p>
    </div>
  );
};

export default Welcome;
