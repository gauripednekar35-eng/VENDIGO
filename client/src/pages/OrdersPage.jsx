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
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">Waiting for Vendor</span>;
      case 'Accepted':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">Accepted</span>;
      case 'Preparing':
        return <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping"></span> Cooking & Preparing
        </span>;
      case 'Ready':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Ready for Pickup</span>;
      case 'Delivered':
        return <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
        </span>;
      case 'Cancelled':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span>My Street Food Orders</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Track live order status and view Cash on Delivery order history.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-extrabold">
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
            <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-extrabold text-slate-900">{order.id}</span>
                    <span>•</span>
                    <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-primary mt-1">{order.vendorName}</h3>
                </div>

                <div>
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</p>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-800 font-semibold">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & COD Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 pt-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Delivery Address</p>
                    <p className="text-slate-500">{order.customerAddress}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Payment Summary</p>
                    <p className="text-slate-500">{order.paymentMethod} • <span className="font-extrabold text-slate-900">Total: ₹{order.totalAmount}</span></p>
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
