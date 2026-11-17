import React from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, MapPin, Phone, ShieldCheck, ArrowLeft } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const OrdersPage = ({ onExploreMore, onBack }) => {
  const { user } = useAuth();
  const { getOrdersForCustomer, fetchOrders } = useOrders();

  React.useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user]);

  const customerOrders = getOrdersForCustomer(user?.email);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">Waiting for Vendor</span>;
      case 'Accepted':
        return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">Accepted</span>;
      case 'Preparing':
        return <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span> Cooking &amp; Preparing
        </span>;
      case 'Ready':
        return <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">Ready for Pickup</span>;
      case 'Delivered':
        return <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
        </span>;
      case 'Cancelled':
        return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
              <span>My Street Food Orders</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Track live order status and view Cash on Delivery order history.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
          {customerOrders.length} Orders
        </span>
      </div>

      {customerOrders.length === 0 ? (
        <EmptyState
          type="cart"
          title="No orders placed yet"
          message="You haven't ordered any delicious street food yet. Discover local vendors now!"
          actionText="Discover Street Vendors"
          onAction={onExploreMore}
        />
      ) : (
        <div className="space-y-6">
          {customerOrders.map(order => (
            <div key={order.id} className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/50 space-y-4">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/50 pb-4 gap-2">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-extrabold text-white">{order.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-emerald-400 mt-1">{order.vendorName}</h3>
                </div>
                <div>
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordered Items</p>
                <div className="bg-slate-900/50 p-4 rounded-2xl space-y-2 text-xs border border-slate-700/40">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-200 font-semibold">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="text-emerald-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & COD Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 pt-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-200">Delivery Address</p>
                    <p className="text-slate-400 mt-0.5">{order.customerAddress}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-200">Payment Summary</p>
                    <p className="text-slate-400 mt-0.5">{order.paymentMethod} • <span className="font-extrabold text-white">Total: ₹{order.totalAmount}</span></p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
