import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  customerAddress: { type: String, required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: { type: Number, required: true },
  packingFee: { type: Number, default: 15 },
  deliveryFee: { type: Number, default: 20 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery (COD)' },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
