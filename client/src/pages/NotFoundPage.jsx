import React from 'react';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center p-4">
      <div className="space-y-4 max-w-md">
        <div className="w-20 h-20 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-lg font-bold text-slate-800">Street Stall Not Found</h2>
        <p className="text-xs text-slate-500">
          The street food page or vendor listing you are looking for has been moved or doesn't exist.
        </p>
        <button
          onClick={onGoHome}
          className="px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold shadow-md hover:bg-primary-dark transition-all inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home Discovery</span>
        </button>
      </div>
    </div>
  );
};
