import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 1 },
  distance: { type: String, default: '1.0 km' },
  prepTime: { type: String, default: '15 min' },
  address: { type: String, required: true },
  coordinates: { type: [Number], default: [28.6139, 77.2090] },
  category: { type: String, default: 'chaat' },
  isOpen: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  priceForTwo: { type: String, default: '₹150 for two' },
  banner: { type: String },
  logo: { type: String },
  description: { type: String },
  tags: [String]
}, { timestamps: true });

export const Vendor = mongoose.model('Vendor', vendorSchema);
