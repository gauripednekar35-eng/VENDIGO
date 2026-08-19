import React from 'react';
import { Utensils, SearchX, ShoppingBag, Store } from 'lucide-react';

export const EmptyState = ({ type = 'search', title, message, actionText, onAction }) => {
  const getIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingBag className="w-12 h-12 text-slate-300" />;
      case 'vendor':
        return <Store className="w-12 h-12 text-slate-300" />;
      default:
        return <SearchX className="w-12 h-12 text-slate-300" />;
    }
  };

  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
        {getIcon()}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title || 'No vendors found'}</h3>
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        {message || 'Try tweaking your search term, switching categories, or clearing filters.'}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-bold shadow-md transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
