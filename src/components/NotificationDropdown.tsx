import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Flame, PackageCheck, Sparkles, CheckCheck, Clock, ExternalLink } from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setViewingDropId,
    setTrackingOrderId,
    setActiveCustomerTab,
    setRole,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.dropId) {
      setRole('customer');
      setViewingDropId(notif.dropId);
      setIsOpen(false);
    } else if (notif.orderId) {
      setRole('customer');
      setTrackingOrderId(notif.orderId);
      setActiveCustomerTab('orders');
      setIsOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'drop_urgent':
      case 'drop_live':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'order_update':
        return <PackageCheck className="w-4 h-4 text-emerald-500" />;
      case 'vip_perk':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="btn-notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full transition cursor-pointer"
        aria-label="View notifications"
        title="Notifications"
      >
        <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-1.5 sm:ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="notifications-popover"
          className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-2 max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h4 className="font-semibold text-sm">Flash Alerts & Drops</h4>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-amber-500/30 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-stone-300 stroke-[1.5]" />
                No new notifications. You're ready for the next drop!
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 transition cursor-pointer flex items-start gap-3 hover:bg-amber-50/50 ${
                    !notif.read ? 'bg-amber-50/30' : 'bg-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-stone-100 mt-0.5 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold truncate ${!notif.read ? 'text-stone-950' : 'text-stone-700'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                      {(notif.dropId || notif.orderId) && (
                        <span className="text-amber-700 font-medium flex items-center gap-0.5">
                          View details <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center text-[11px] text-stone-500">
            Push alerts are enabled for instant flash drops
          </div>
        </div>
      )}
    </div>
  );
};
