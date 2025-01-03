import React from 'react';

export const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-orange-50">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-[#FF8938] border-t-transparent animate-spin"></div>
        <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-[#E6A623] border-t-transparent animate-spin-slow"></div>
      </div>
    </div>
  );
};

export default Loader;