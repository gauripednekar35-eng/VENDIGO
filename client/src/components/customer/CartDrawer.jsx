import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export const CartDrawer = ({ onOrderPlaced }) => {
  const { cartItems, activeVendor, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, subtotal, packingFee, deliveryFee, totalAmount } = useCart();
  const { user, showToast } = useAuth();
  const { createOrder } = useOrders();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Room 302, DU North Campus Hostel, Old Delhi');
  const [phone, setPhone] = useState(user?.phone || '+91 98111 22233');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCartOpen) return null;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0 || !activeVendor) return;

    setIsPlacing(true);

    setTimeout(() => {
      const order = createOrder({
        vendorId: activeVendor.id,
        vendorName: activeVendor.name,
        customerName: user?.name || 'Street Food Lover',
        customerEmail: user?.email || 'customer@vendigo.com',
        customerPhone: phone,
        customerAddress: deliveryAddress,
        items: cartItems,
        subtotal,
        packingFee,
        deliveryFee,
        totalAmount
      });

      setIsPlacing(false);
      clearCart();
      setIsCartOpen(false);
      showToast(`Order #${order.id} placed successfully! Cash on Delivery confirmed.`, 'success');
      if (onOrderPlaced) onOrderPlaced(order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Your Street Food Cart</h3>
                {activeVendor && (
                  <p className="text-xs font-bold text-primary truncate max-w-[220px]">
                    From: {activeVendor.name}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Your cart is currently empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse authentic street food stalls around you and add your favorite chaat, momos or dosa!
                </p>
              </div>
            ) : (
              <>
                {/* List of items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</span>
                    <button 
                      onClick={clearCart}
                      className="text-[11px] font-semibold text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Cart
                    </button>
                  </div>

                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs font-black text-slate-700">₹{item.price * item.quantity}</p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address & Contact */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Details</span>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary"
                        placeholder="Enter full hostel/street address..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Contact Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendor Eco-Packing Fee</span>
                    <span className="font-bold text-slate-900">₹{packingFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Delivery Fee</span>
                    <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Payment Method Badge */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Payment Method: Cash on Delivery (COD)</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Trigger */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white space-y-3">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isPlacing ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{totalAmount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
