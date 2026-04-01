import React from 'react';

export const DeliverySkeleton = () => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-[#1A1A1A] rounded-[32px] p-6 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2 w-1/2">
            <div className="h-3 bg-[#2A2A2A] rounded w-1/2" />
            <div className="h-5 bg-[#2A2A2A] rounded w-3/4" />
          </div>
          <div className="h-4 bg-[#2A2A2A] rounded w-1/4" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-[#2A2A2A] rounded w-full" />
          <div className="h-3 bg-[#2A2A2A] rounded w-2/3" />
        </div>
        <div className="h-12 bg-[#2A2A2A] rounded-2xl w-full mt-2" />
      </div>
    ))}
  </div>
);

export const EarningsSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-[#1A1A1A] rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-2/3">
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-xl" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-[#2A2A2A] rounded w-3/4" />
            <div className="h-3 bg-[#2A2A2A] rounded w-1/2" />
          </div>
        </div>
        <div className="h-4 bg-[#2A2A2A] rounded w-1/4" />
      </div>
    ))}
  </div>
);
