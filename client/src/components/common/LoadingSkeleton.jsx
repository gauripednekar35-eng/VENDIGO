import React from 'react';

export const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-card space-y-4">
          <div className="w-full h-44 rounded-2xl skeleton" />
          <div className="space-y-2">
            <div className="w-3/4 h-5 rounded skeleton" />
            <div className="w-1/2 h-4 rounded skeleton" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="w-20 h-4 rounded skeleton" />
            <div className="w-16 h-8 rounded-xl skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
};
