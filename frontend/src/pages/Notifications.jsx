import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Truck,
  ShieldCheck,
  Package,
  Clock,
  CloudRain,
  Layers,
  ArrowRight,
  Filter,
  CheckCheck,
  RefreshCw,
  X,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI, weatherAPI } from '../services/api';

// ============================================================================
// NOTIFICATION TYPE CONFIGURATION (Only existing backend types)
// ============================================================================
const TYPE_CONFIG = {
  LOGISTICS_DISPATCH: {
    label: 'Logistics Dispatch',
    icon: Truck,
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    defaultAction: { label: 'Track Dispatch Fleet', to: '/logistics' },
    category: 'Logistics'
  },
  ESCROW_RELEASE: {
    label: 'Escrow Vault',
    icon: ShieldCheck,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    defaultAction: { label: 'View Escrow Orders', to: '/orders' },
    category: 'Orders'
  },
  WASTE_ALERT: {
    label: 'Waste Rescue',
    icon: AlertTriangle,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    defaultAction: { label: 'Review Flash Sale', to: '/waste-reduction' },
    category: 'Alerts'
  },
  ORDER_UPDATE: {
    label: 'Order Update',
    icon: Package,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    defaultAction: { label: 'Inspect Order Details', to: '/orders' },
    category: 'Orders'
  },
  WEATHER_ALERT: {
    label: 'Weather Alert',
    icon: CloudRain,
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
    defaultAction: { label: 'View Agronomic Advisory', to: '/advisor' },
    category: 'Alerts'
  },
  SYSTEM: {
    label: 'System Update',
    icon: Info,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    defaultAction: { label: 'Browse Marketplace', to: '/crops' },
    category: 'Updates'
  }
};

export const Notifications = () => {
  const { user, isFarmer, isLogistics, isSupplier, isAdmin } = useAuth();

  // --------------------------------------------------------------------------
  // PAGE STATE MACHINE
  // 'PAGE_LOADING' | 'NOTIFICATIONS_READY' | 'LOAD_ERROR'
  // --------------------------------------------------------------------------
  const [pageState, setPageState] = useState('PAGE_LOADING');
  const [notifications, setNotifications] = useState([]);
  const [weatherAlert, setWeatherAlert] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL' | 'UNREAD' | 'Alerts' | 'Orders' | 'Logistics' | 'Updates'
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [markingId, setMarkingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // --------------------------------------------------------------------------
  // LOAD REAL DATA FROM BACKEND APIS
  // --------------------------------------------------------------------------
  const loadNotificationsData = async () => {
    setPageState('PAGE_LOADING');
    setActionError(null);
    try {
      const [notifsRes, weatherRes] = await Promise.allSettled([
        notificationsAPI.getAll(),
        weatherAPI.getIntelligence(user?.location || 'Nuwara Eliya')
      ]);

      let notifList = [];
      if (notifsRes.status === 'fulfilled' && notifsRes.value) {
        const raw = notifsRes.value.data || notifsRes.value;
        notifList = Array.isArray(raw) ? raw : [];
      }

      if (weatherRes.status === 'fulfilled' && weatherRes.value) {
        const wData = weatherRes.value.data || weatherRes.value;
        if (wData && wData.warning) {
          setWeatherAlert({
            title: wData.warning,
            advisory: wData.advisory || 'Avoid fertilizer application. Clear drainage channels.',
            location: wData.location || user?.location || 'Nuwara Eliya',
            severity: 'HIGH'
          });
        }
      }

      setNotifications(notifList);
      setPageState('NOTIFICATIONS_READY');
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setPageState('LOAD_ERROR');
    }
  };

  useEffect(() => {
    loadNotificationsData();
  }, [user]);

  // --------------------------------------------------------------------------
  // MARK INDIVIDUAL NOTIFICATION AS READ
  // --------------------------------------------------------------------------
  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    const target = notifications.find((n) => n.id === id);
    if (!target || target.read) return;

    setMarkingId(id);
    setActionError(null);
    try {
      await notificationsAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      if (selectedNotification?.id === id) {
        setSelectedNotification((prev) => (prev ? { ...prev, read: true } : null));
      }
    } catch (err) {
      console.error('Mark read error:', err);
      setActionError('Unable to update notification. Try again.');
    } finally {
      setMarkingId(null);
    }
  };

  // --------------------------------------------------------------------------
  // MARK ALL NOTIFICATIONS AS READ
  // --------------------------------------------------------------------------
  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    setActionError(null);
    try {
      await Promise.allSettled(unread.map((n) => notificationsAPI.markRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Mark all read error:', err);
      setActionError('Unable to update all notifications. Try again.');
    }
  };

  // --------------------------------------------------------------------------
  // FILTERING LOGIC
  // --------------------------------------------------------------------------
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const filteredList = useMemo(() => {
    if (filterCategory === 'ALL') return notifications;
    if (filterCategory === 'UNREAD') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => {
      const conf = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
      return conf.category === filterCategory;
    });
  }, [notifications, filterCategory]);

  // --------------------------------------------------------------------------
  // SKELETON LOADER STATE
  // --------------------------------------------------------------------------
  if (pageState === 'PAGE_LOADING') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-pulse">
        <div className="agri-card p-5 bg-white space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-80 bg-slate-100 rounded"></div>
        </div>

        <div className="h-24 bg-amber-50/70 border border-amber-200/50 rounded-2xl"></div>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-slate-200 rounded-xl"></div>
          ))}
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="agri-card p-4 bg-white h-24 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------------------------
  if (pageState === 'LOAD_ERROR') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Unable to load notifications.</h2>
        <p className="text-xs text-slate-500">
          We encountered an issue retrieving real-time notifications. Please try again.
        </p>
        <button
          onClick={loadNotificationsData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 text-slate-900 animate-fade-in">
      {/* ==================================================================== */}
      {/* 5. PAGE HEADER (Compact, non-marketing, with "Mark all as read")     */}
      {/* ==================================================================== */}
      <div className="agri-card p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-800" />
              <span>Alerts &amp; Notifications</span>
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Stay updated on crop risks, services, orders, and important agricultural information.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition self-start sm:self-auto shadow-2xs"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Action error banner if mark as read fails */}
      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
          <span>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="text-xs font-bold text-red-900 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. PRIORITY ALERTS (Rendered only when active high-priority alert)   */}
      {/* ==================================================================== */}
      {weatherAlert && (
        <div className="agri-card p-4 sm:p-5 bg-amber-50/60 border border-amber-200/90 rounded-2xl space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider border border-amber-300">
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              <span>Attention Needed</span>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">
              Region: {weatherAlert.location}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {weatherAlert.title}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {weatherAlert.advisory}
            </p>
          </div>

          <div className="pt-2 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[11px] text-amber-800 font-medium">
              Affected: Sensitive upcountry &amp; greenhouse harvests
            </span>
            <Link
              to="/advisor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition shadow-2xs"
            >
              <span>View Agronomic Advisory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 10. NOTIFICATION FILTERS (Categories)                                */}
      {/* ==================================================================== */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
        {[
          { key: 'ALL', label: 'All Notifications', count: notifications.length },
          { key: 'UNREAD', label: 'Unread', count: unreadCount },
          { key: 'Alerts', label: 'Urgent Alerts' },
          { key: 'Orders', label: 'Orders & Escrow' },
          { key: 'Logistics', label: 'Logistics Fleet' },
          { key: 'Updates', label: 'Platform Updates' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterCategory(tab.key)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 border ${
              filterCategory === tab.key
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filterCategory === tab.key
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* 7. NOTIFICATION LIST & 8. READ / UNREAD DISTINCTION                  */}
      {/* ==================================================================== */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          /* 13. EMPTY STATES */
          <div className="agri-card p-12 bg-white text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {filterCategory === 'UNREAD' ? 'No unread notifications.' : "You're all caught up."}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filterCategory === 'UNREAD'
                ? 'All pending alerts and activity have been acknowledged.'
                : 'No new alerts or updates right now.'}
            </p>
            {filterCategory !== 'ALL' && (
              <button
                onClick={() => setFilterCategory('ALL')}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          filteredList.map((notif) => {
            const conf = TYPE_CONFIG[notif.type] || TYPE_CONFIG.SYSTEM;
            const IconComponent = conf.icon;
            const isMarking = markingId === notif.id;

            return (
              <div
                key={notif.id}
                onClick={() => {
                  setSelectedNotification(notif);
                  if (!notif.read) handleMarkRead(notif.id);
                }}
                className={`agri-card p-4 sm:p-5 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  notif.read
                    ? 'bg-white border-slate-200/80 opacity-90'
                    : 'bg-emerald-50/20 border-emerald-300/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Category icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${conf.badgeClass}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Unread dot indicator + type badge */}
                      {!notif.read && (
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"
                          title="Unread notification"
                        />
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${conf.badgeClass}`}>
                        {conf.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {notif.timestamp}
                      </span>
                    </div>

                    <h3
                      className={`text-xs sm:text-sm tracking-tight truncate ${
                        notif.read ? 'font-medium text-slate-800' : 'font-bold text-slate-950'
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* 12. RELATED ACTION LINK */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                  <Link
                    to={conf.defaultAction.to}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
                  >
                    <span>{conf.defaultAction.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>

                  {!notif.read && (
                    <button
                      onClick={(e) => handleMarkRead(notif.id, e)}
                      disabled={isMarking}
                      className="text-slate-400 hover:text-emerald-700 p-1 rounded-lg transition"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ==================================================================== */}
      {/* 9. NOTIFICATION DETAILS MODAL                                        */}
      {/* ==================================================================== */}
      {selectedNotification && (() => {
        const conf = TYPE_CONFIG[selectedNotification.type] || TYPE_CONFIG.SYSTEM;
        const IconComponent = conf.icon;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${conf.badgeClass}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {conf.label}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {selectedNotification.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 leading-relaxed text-slate-700">
                  {selectedNotification.message}
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-semibold text-slate-800">{selectedNotification.timestamp}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span className="text-slate-400">Reference ID:</span>
                  <span className="font-mono text-slate-700">{selectedNotification.id}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-emerald-800">
                    {selectedNotification.read ? 'Acknowledged' : 'Unread'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  to={conf.defaultAction.to}
                  className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs text-center transition flex items-center justify-center gap-1.5"
                >
                  <span>{conf.defaultAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Notifications;
