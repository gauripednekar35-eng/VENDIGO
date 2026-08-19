import React, { useState } from 'react';
import { Bell, X, Package, Tag, MapPin, Star, ChevronRight } from 'lucide-react';
import { CustomLocationDropdown } from './CustomLocationDropdown';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    icon: Package,
    iconColor: '#059669',
    title: 'Order Confirmed!',
    body: 'Your order from Dahisar Vada Pav Corner is being prepared.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    type: 'promo',
    icon: Tag,
    iconColor: '#F97316',
    title: '🎉 20% OFF Today!',
    body: 'Use code VENDIGO20 on your next order. Valid till midnight.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 3,
    type: 'nearby',
    icon: MapPin,
    iconColor: '#6366F1',
    title: 'New Stall Nearby',
    body: 'Indiranagar Ghee Roast Dosa Corner just opened near you!',
    time: '3 hrs ago',
    unread: false,
  },
  {
    id: 4,
    type: 'review',
    icon: Star,
    iconColor: '#FBBF24',
    title: 'Rate Your Order',
    body: 'How was your Samosa from Borivali Chaat House? Tap to review.',
    time: 'Yesterday',
    unread: false,
  },
];

export const TopHeader = ({ selectedLocation, setSelectedLocation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          {/* Custom Location Dropdown */}
          <CustomLocationDropdown
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            isMobile={true}
          />

          {/* Bell Notification Button */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative w-9 h-9 rounded-full bg-[#1E293B] border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all active:scale-95"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Notifications Slide-in Panel */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={() => setShowNotifications(false)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-[#0F172A] border-l border-slate-700/80 z-[201] flex flex-col shadow-2xl animate-slide-in-right">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-black text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1">
              {notifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setNotifications(prev =>
                        prev.map(n => n.id === notif.id ? { ...n, unread: false } : n)
                      );
                    }}
                    className={`mx-3 p-3.5 rounded-2xl flex items-start space-x-3 cursor-pointer transition-all active:scale-[0.98] ${
                      notif.unread
                        ? 'bg-[#1E293B] border border-slate-700/60'
                        : 'bg-transparent border border-transparent'
                    }`}
                  >
                    {/* Icon Circle */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: notif.iconColor + '22', border: `1.5px solid ${notif.iconColor}55` }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: notif.iconColor }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${notif.unread ? 'text-white' : 'text-slate-300'}`}>
                          {notif.title}
                        </p>
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                        {notif.body}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{notif.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-800">
              <button className="w-full flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors py-2">
                <span>View all notifications</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
