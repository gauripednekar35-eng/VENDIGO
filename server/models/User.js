import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  address: { type: String },
  vendorId: { type: String }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
