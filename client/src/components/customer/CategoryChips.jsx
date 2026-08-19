import React from 'react';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { Flame, Sandwich, Soup, Sun, Utensils, Coffee, IceCream } from 'lucide-react';

export const CategoryChips = ({ selectedCategory, setSelectedCategory }) => {
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'chaat': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'rolls': return <Sandwich className="w-4 h-4 text-amber-500" />;
      case 'momos': return <Soup className="w-4 h-4 text-red-500" />;
      case 'dosa': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'desserts': return <IceCream className="w-4 h-4 text-pink-500" />;
      case 'beverages': return <Coffee className="w-4 h-4 text-teal-500" />;
      default: return <Utensils className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="mb-8 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">What's on your mind?</h2>
        <span className="text-xs text-slate-500">Popular Street Food Categories</span>
      </div>

      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {INITIAL_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all transform active:scale-95 shrink-0 border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-subtle'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
