import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  image: { type: String },
  description: { type: String }
}, { timestamps: true });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
