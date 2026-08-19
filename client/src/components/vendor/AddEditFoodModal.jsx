import React, { useState, useEffect } from 'react';
import { X, Utensils, DollarSign, Image, FileText } from 'lucide-react';

export const AddEditFoodModal = ({ isOpen, onClose, onSave, itemToEdit, vendorId }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Chaat & Snacks',
    isVeg: true,
    description: '',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80'
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        price: itemToEdit.price || '',
        category: itemToEdit.category || 'Chaat & Snacks',
        isVeg: itemToEdit.isVeg !== undefined ? itemToEdit.isVeg : true,
        description: itemToEdit.description || '',
        image: itemToEdit.image || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'Chaat & Snacks',
        isVeg: true,
        description: '',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80'
      });
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    onSave({
      ...formData,
      vendorId: itemToEdit ? itemToEdit.vendorId : vendorId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-secondary" />
            <span>{itemToEdit ? 'Edit Street Dish' : 'Add New Food Item'}</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Food Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Special Kurkure Momos, Paneer Tikka Kathi Roll..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="120"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-medium"
              >
                <option value="Chaat & Snacks">Chaat & Snacks</option>
                <option value="Kathi Rolls">Kathi Rolls</option>
                <option value="Momos">Momos</option>
                <option value="South Indian">South Indian</option>
                <option value="Indo-Chinese">Indo-Chinese</option>
                <option value="Sweets & Kulfi">Sweets & Kulfi</option>
                <option value="Chai & Drinks">Chai & Drinks</option>
              </select>
            </div>
          </div>

          {/* Veg / Non-Veg Radio Toggle */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Dietary Type</label>
            <div className="flex space-x-4 pt-1">
              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="isVeg"
                  checked={formData.isVeg === true}
                  onChange={() => setFormData({ ...formData, isVeg: true })}
                  className="accent-primary"
                />
                <span className="flex items-center gap-1.5">
                  <span className="veg-indicator"></span> Veg
                </span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="isVeg"
                  checked={formData.isVeg === false}
                  onChange={() => setFormData({ ...formData, isVeg: false })}
                  className="accent-red-600"
                />
                <span className="flex items-center gap-1.5">
                  <span className="nonveg-indicator"></span> Non-Veg
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              rows="3"
              placeholder="Short description of ingredients, spice level, or special recipe..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Food Image URL (Cloudinary / Unsplash)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-md"
            >
              {itemToEdit ? 'Save Changes' : 'Add Food Item'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
