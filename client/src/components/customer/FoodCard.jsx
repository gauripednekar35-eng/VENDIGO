import React from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus } from 'lucide-react';

export const FoodCard = ({ item, vendor }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-subtle hover:shadow-card transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      
      {/* Left Item Details */}
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center space-x-2">
          {item.isVeg ? (
            <span className="veg-indicator" title="Vegetarian"></span>
          ) : (
            <span className="nonveg-indicator" title="Non-Vegetarian"></span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {item.category}
          </span>
        </div>

        <h4 className="text-base font-extrabold text-slate-900 leading-tight">
          {item.name}
        </h4>

        <p className="text-sm font-black text-slate-900">
          ₹{item.price}
        </p>

        <p className="text-xs text-slate-500 leading-relaxed max-w-lg line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Right Image & Add Button */}
      <div className="relative shrink-0 w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/* Floating Add / Quantity Controller */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 shadow-lg rounded-xl overflow-hidden">
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(item, vendor)}
              disabled={!item.isAvailable}
              className={`px-6 py-1.5 text-xs font-black tracking-wider uppercase transition-all ${
                item.isAvailable 
                  ? 'bg-white text-primary hover:bg-primary-50 border border-primary/20 shadow-md' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              {item.isAvailable ? 'ADD' : 'SOLD OUT'}
            </button>
          ) : (
            <div className="flex items-center space-x-3 px-3 py-1 bg-primary text-white text-xs font-black shadow-md rounded-xl">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="hover:text-amber-200 focus:outline-none"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="hover:text-amber-200 focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
