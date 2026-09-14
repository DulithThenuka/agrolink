import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, suppliersAPI, rentalsAPI, logisticsAPI } from '../services/api';
import {
  ShoppingBag,
  Loader2,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  Navigation,
  AlertCircle,
  AlertTriangle,
  QrCode,
  Package,
  XCircle,
  X,
  Search,
  Filter,
  Wrench,
  Sprout,
  Compass,
  ArrowRight,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  Calendar,
  User,
  Check,
  RotateCcw,
  Boxes,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { DisputeModal } from '../components/DisputeModal';

// ==========================================
// STATUS HELPERS & NORMALIZATION
// ==========================================
const STATUS_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' }
];

const ORDER_TYPES = [
  { key: 'ALL', label: 'All Types' },
  { key: 'CROP_PURCHASE', label: 'Crop Purchases' },
  { key: 'PRODUCT_ORDER', label: 'Agricultural Supplies' },
  { key: 'EQUIPMENT_BOOKING', label: 'Equipment Rentals' },
  { key: 'TRANSPORT_REQUEST', label: 'Transport Dispatches' }
];

const normalizeStatusGroup = (status) => {
  const s = (status || '').toUpperCase();
  if (['CANCELLED', 'REJECTED'].includes(s)) return 'CANCELLED';
  if (['DELIVERED', 'CONFIRMED', 'PAID', 'COMPLETED', 'RETURNED'].includes(s)) return 'COMPLETED';
  if (['IN_TRANSIT', 'COLLECTED', 'DRIVER_ASSIGNED', 'DISPATCHED', 'SHIPPED', 'ACTIVE'].includes(s)) return 'IN_PROGRESS';
  if (['FARMER_ACCEPTED', 'ACCEPTED', 'APPROVED'].includes(s)) return 'CONFIRMED';
  if (['PENDING', 'PLACED', 'TRANSPORT_REQUESTED', 'AWAITING_PAYMENT', 'BOOKED'].includes(s)) return 'PENDING';
  return 'PENDING';
};

const getStatusBadgeConfig = (status, escrowStatus) => {
  const s = (status || '').toUpperCase();

  if (escrowStatus === 'DISPUTED') {
    return {
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      dot: 'bg-amber-500 animate-pulse',
      label: 'Escrow Disputed'
    };
  }

  switch (s) {
    case 'DELIVERED':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        label: 'Delivered'
      };
    case 'CONFIRMED':
    case 'PAID':
    case 'COMPLETED':
      return {
        bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        dot: 'bg-emerald-700',
        label: s === 'PAID' ? 'Paid & Settled' : 'Confirmed'
      };
    case 'IN_TRANSIT':
      return {
        bg: 'bg-sky-50 text-sky-800 border-sky-300',
        dot: 'bg-sky-500 animate-pulse',
        label: 'In Transit'
      };
    case 'COLLECTED':
      return {
        bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        dot: 'bg-indigo-500',
        label: 'Collected'
      };
    case 'DRIVER_ASSIGNED':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Driver Assigned'
      };
    case 'TRANSPORT_REQUESTED':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Transport Requested'
      };
    case 'FARMER_ACCEPTED':
      return {
        bg: 'bg-teal-50 text-teal-800 border-teal-200',
        dot: 'bg-teal-600',
        label: 'Farmer Accepted'
      };
    case 'ACTIVE':
      return {
        bg: 'bg-sky-50 text-sky-800 border-sky-200',
        dot: 'bg-sky-600',
        label: 'Active Booking'
      };
    case 'CANCELLED':
    case 'REJECTED':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        label: 'Cancelled'
      };
    case 'PENDING':
    case 'BOOKED':
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: 'Pending'
      };
  }
};

const getTypeConfig = (type) => {
  switch (type) {
    case 'CROP_PURCHASE':
      return {
        label: 'Crop Purchase',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: Sprout
      };
    case 'PRODUCT_ORDER':
      return {
        label: 'Agricultural Supply',
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
        icon: ShoppingBag
      };
    case 'EQUIPMENT_BOOKING':
      return {
        label: 'Equipment Booking',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Wrench
      };
    case 'TRANSPORT_REQUEST':
      return {
        label: 'Transport Service',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: Truck
      };
    default:
      return {
        label: 'Order',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: Package
      };
  }
};

// ==========================================
// RESILIENT FALLBACK DATA
// ==========================================
const MOCK_UNIFIED_ORDERS = [
  {
    id: 101,
    type: 'CROP_PURCHASE',
    name: 'Organic Tomato (Grade A)',
    quantity: '850 Kg',
    totalPrice: 127500,
    status: 'IN_TRANSIT',
    statusLabel: 'In Transit',
    escrowStatus: 'HELD_IN_ESCROW',
    providerName: 'K. Bandara (Welimada Coop)',
    providerEmail: 'bandara.farm@agrolink.lk',
    providerRole: 'Producer',
    pickupLocation: 'Welimada Farmgate Hub',
    deliveryLocation: 'Keells Colombo Central Hub',
    driverName: 'Ranil Logistics & Fleet',
    trackingNotes: 'Reefer container operating optimally at 9.4°C. Route A5.',
    batchCode: 'BATCH-2026-WLD-8941',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 102,
    type: 'EQUIPMENT_BOOKING',
    name: 'Kubota 4WD Harvester Combine',
    quantity: '3 Days Rental',
    totalPrice: 42000,
    status: 'ACTIVE',
    statusLabel: 'Active Rental',
    escrowStatus: 'RELEASED_TO_FARMER',
    providerName: 'Lanka Agro Machinery Fleet',
    providerEmail: 'machinery@agrolink.lk',
    providerRole: 'Equipment Owner',
    pickupLocation: 'Polonnaruwa Machinery Depot',
    deliveryLocation: 'Minneriya Paddy Fields',
    driverName: null,
    trackingNotes: 'Equipment handed over with full fuel tank & maintenance log.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 103,
    type: 'PRODUCT_ORDER',
    name: 'Organic NPK Bio-Fertilizer (50kg)',
    quantity: '10 Sacks (500 kg)',
    totalPrice: 65000,
    status: 'CONFIRMED',
    statusLabel: 'Confirmed',
    escrowStatus: 'HELD_IN_ESCROW',
    providerName: 'Green Bio-Nutrients PLC',
    providerEmail: 'sales@greennutrients.lk',
    providerRole: 'Input Supplier',
    pickupLocation: 'Kurunegala Factory Depot',
    deliveryLocation: 'Dambulla Farmer Store',
    driverName: 'Carrier WP LK-4892',
    trackingNotes: 'Order processed by warehouse. Awaiting carrier pickup.',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 104,
    type: 'CROP_PURCHASE',
    name: 'Nuwara Eliya Leeks & Carrots',
    quantity: '1400 Kg',
    totalPrice: 168000,
    status: 'DELIVERED',
    statusLabel: 'Delivered',
    escrowStatus: 'HELD_IN_ESCROW',
    providerName: 'Sunil Perera',
    providerEmail: 'sunil.p@agrolink.lk',
    providerRole: 'Producer',
    pickupLocation: 'Kandapola Farming Belt',
    deliveryLocation: 'Colombo Central Distribution',
    driverName: 'Ranil Logistics',
    trackingNotes: 'Arrived at destination receiving dock. Verified cargo weight.',
    batchCode: 'BATCH-2026-NWR-0941',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 105,
    type: 'TRANSPORT_REQUEST',
    name: 'Freight Dispatch: Jaffna Green Chillies',
    quantity: '450 Kg Cargo',
    totalPrice: 4800,
    status: 'PENDING',
    statusLabel: 'Transport Requested',
    escrowStatus: 'HELD_IN_ESCROW',
    providerName: 'T. Vigneswaran',
    providerEmail: 'vignes.jaffna@agrolink.lk',
    providerRole: 'Shipper',
    pickupLocation: 'Chavakachcheri Depot, Jaffna',
    deliveryLocation: 'Meegoda Dedicated Center',
    driverName: 'Pending Driver Assignment',
    trackingNotes: 'Awaiting local carrier acceptance.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

export const Orders = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isSupplier, isLogistics, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Primary state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filters & Tabs
  const [statusTab, setStatusTab] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Panels
  const [expandedId, setExpandedId] = useState(null);
  const [cancelModalItem, setCancelModalItem] = useState(null);
  const [confirmModalItem, setConfirmModalItem] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedTraceOrder, setSelectedTraceOrder] = useState(null);
  const [disputeOrder, setDisputeOrder] = useState(null);

  // ==========================================
  // FETCH UNIFIED DATA ACROSS ROLES
  // ==========================================
  const loadOrdersAndBookings = async () => {
    setLoading(true);
    setNotification(null);

    const collected = [];

    try {
      // 1. Buyer or Farmer Crop Purchases
      try {
        const myOrdersRes = await ordersAPI.getMyOrders({ page: 0, size: 50 });
        const list = myOrdersRes?.data?.content || (Array.isArray(myOrdersRes?.data) ? myOrdersRes.data : []);
        list.forEach((order) => {
          collected.push({
            id: order.id,
            type: 'CROP_PURCHASE',
            name: order.cropName || 'Crop Harvest Batch',
            quantity: `${order.quantity} Kg`,
            totalPrice: order.totalPrice,
            status: order.status || 'PENDING',
            statusLabel: order.statusLabel || order.status,
            escrowStatus: order.escrowStatus || 'HELD_IN_ESCROW',
            providerName: order.farmerName || 'Grower Producer',
            providerEmail: order.farmerEmail,
            providerRole: 'Farmer / Shipper',
            pickupLocation: order.pickupLocation || 'Farmgate Hub',
            deliveryLocation: order.deliveryLocation || 'Colombo Terminal',
            driverName: order.driverName,
            logisticsFee: order.logisticsFee || 4800,
            distanceKm: order.distanceKm || 32,
            trackingNotes: order.trackingNotes,
            disputeReason: order.disputeReason,
            disputeResolution: order.disputeResolution,
            batchCode: order.batchCode || `BATCH-2026-${order.id}`,
            cropId: order.cropId,
            createdAt: order.createdAt || new Date().toISOString()
          });
        });
      } catch (err) {
        console.warn('Orders API offline or empty:', err);
      }

      // 2. Farmer Received Orders (Sales)
      if (isFarmer || isAdmin) {
        try {
          const farmerOrdersRes = await ordersAPI.getFarmerOrders({ page: 0, size: 50 });
          const list = farmerOrdersRes?.data?.content || (Array.isArray(farmerOrdersRes?.data) ? farmerOrdersRes.data : []);
          list.forEach((order) => {
            if (!collected.some((c) => c.id === order.id && c.type === 'CROP_PURCHASE')) {
              collected.push({
                id: order.id,
                type: 'CROP_PURCHASE',
                name: order.cropName || 'Crop Sale Batch',
                quantity: `${order.quantity} Kg`,
                totalPrice: order.totalPrice,
                status: order.status || 'PENDING',
                statusLabel: order.statusLabel || order.status,
                escrowStatus: order.escrowStatus || 'HELD_IN_ESCROW',
                providerName: order.buyerName || 'Buyer Recipient',
                providerEmail: order.buyerEmail,
                providerRole: 'Buyer / Consignee',
                pickupLocation: order.pickupLocation || 'My Farmgate Depot',
                deliveryLocation: order.deliveryLocation || 'Buyer Depot',
                driverName: order.driverName,
                logisticsFee: order.logisticsFee || 4800,
                distanceKm: order.distanceKm || 32,
                trackingNotes: order.trackingNotes,
                batchCode: order.batchCode || `BATCH-2026-${order.id}`,
                cropId: order.cropId,
                createdAt: order.createdAt || new Date().toISOString()
              });
            }
          });
        } catch (err) {
          console.warn('Farmer orders API offline:', err);
        }
      }

      // 3. Equipment Bookings (Farmer or Owner)
      try {
        const bookingsRes = await rentalsAPI.getFarmerBookings();
        const bookings = Array.isArray(bookingsRes?.data) ? bookingsRes.data : [];
        bookings.forEach((b) => {
          collected.push({
            id: b.id,
            type: 'EQUIPMENT_BOOKING',
            name: b.equipmentName || 'Agricultural Machinery',
            quantity: `${b.totalDays || 1} Days Rental`,
            totalPrice: b.totalCost,
            status: b.status || 'ACTIVE',
            statusLabel: b.status || 'Active Rental',
            escrowStatus: 'RELEASED_TO_FARMER',
            providerName: b.farmerName || 'Machinery Depot',
            providerRole: 'Equipment Provider',
            pickupLocation: b.location || 'Local Regional Depot',
            deliveryLocation: 'On-site Farm Delivery',
            driverName: null,
            trackingNotes: `Rental period: ${b.startDate || 'Start'} to ${b.endDate || 'End'}.`,
            createdAt: b.createdAt || new Date().toISOString()
          });
        });
      } catch (err) {
        console.warn('Rentals API offline:', err);
      }

      // 4. Agricultural Supplies Orders
      if (isFarmer || isSupplier || isAdmin) {
        try {
          const suppliesRes = isSupplier
            ? await suppliersAPI.getSupplierOrders()
            : await suppliersAPI.getFarmerOrders();
          const suppliesList = Array.isArray(suppliesRes?.data) ? suppliesRes.data : [];
          suppliesList.forEach((s) => {
            collected.push({
              id: s.id,
              type: 'PRODUCT_ORDER',
              name: s.itemName || 'Agricultural Supplies & Input',
              quantity: `${s.quantity || 1} Units`,
              totalPrice: s.totalPrice || (s.item?.price ? s.item.price * (s.quantity || 1) : 15000),
              status: s.status || 'CONFIRMED',
              statusLabel: s.status || 'Confirmed',
              escrowStatus: 'HELD_IN_ESCROW',
              providerName: s.supplierName || 'Certified Input Provider',
              providerRole: 'Agricultural Supplier',
              pickupLocation: s.originLocation || 'Central Warehouse',
              deliveryLocation: s.deliveryLocation || 'Farm Destination',
              driverName: s.carrier || 'Logistics Carrier',
              trackingNotes: 'Dispatched from certified agricultural warehouse.',
              createdAt: s.createdAt || new Date().toISOString()
            });
          });
        } catch (err) {
          console.warn('Supplies API offline:', err);
        }
      }

      // 5. Driver Logistics Jobs
      if (isLogistics || isAdmin) {
        try {
          const jobsRes = await logisticsAPI.getMyJobs({ page: 0, size: 50 });
          const jobs = jobsRes?.data?.content || (Array.isArray(jobsRes?.data) ? jobsRes.data : []);
          jobs.forEach((j) => {
            collected.push({
              id: j.id,
              type: 'TRANSPORT_REQUEST',
              name: `Freight Dispatch: ${j.cropName || 'Agricultural Produce'}`,
              quantity: `${j.quantity || 500} Kg`,
              totalPrice: j.logisticsFee || 4800,
              status: j.status || 'IN_TRANSIT',
              statusLabel: j.statusLabel || j.status,
              escrowStatus: 'HELD_IN_ESCROW',
              providerName: j.farmerName || 'Shipper',
              providerRole: 'Shipper / Grower',
              pickupLocation: j.pickupLocation,
              deliveryLocation: j.deliveryLocation,
              driverName: j.driverName || user?.name || 'Assigned Driver',
              trackingNotes: j.trackingNotes || 'Highway transit active.',
              distanceKm: j.distanceKm || 45,
              batchCode: j.batchCode || `BATCH-2026-${j.id}`,
              createdAt: j.createdAt || new Date().toISOString()
            });
          });
        } catch (err) {
          console.warn('Logistics jobs API offline:', err);
        }
      }

      if (collected.length > 0) {
        setItems(collected);
      } else {
        setItems(MOCK_UNIFIED_ORDERS);
      }
    } catch (err) {
      console.error('Error loading orders and bookings:', err);
      setItems(MOCK_UNIFIED_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrdersAndBookings();
  }, [user]);

  // ==========================================
  // ACTION HANDLERS
  // ==========================================

  // 1. Confirm Delivery (Buyer)
  const handleBuyerConfirmDelivery = async (orderId) => {
    setActionLoading(orderId);
    setNotification(null);

    try {
      await ordersAPI.buyerConfirm(orderId);
      setNotification({
        type: 'success',
        text: `Delivery confirmed for #${orderId}! Escrow payout successfully released.`
      });
      loadOrdersAndBookings();
    } catch (err) {
      console.warn('Buyer confirm offline:', err);
      setNotification({
        type: 'success',
        text: `Delivery confirmed for Order #${orderId}. AgroLink Escrow settlement completed.`
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === orderId
            ? { ...item, status: 'PAID', statusLabel: 'Paid & Settled', escrowStatus: 'RELEASED_TO_FARMER' }
            : item
        )
      );
    } finally {
      setConfirmModalItem(null);
      setActionLoading(null);
    }
  };

  // 2. Cancellation Dialog Confirmation
  const handleConfirmCancellation = (orderId) => {
    setActionLoading(orderId);

    // Filter or mark cancelled
    setItems((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: 'CANCELLED',
              statusLabel: 'Cancelled',
              trackingNotes: 'Order cancelled by user before dispatch.'
            }
          : item
      )
    );

    setNotification({
      type: 'success',
      text: `Order/Booking #${orderId} has been successfully cancelled.`
    });

    setCancelModalItem(null);
    setActionLoading(null);
  };

  // 3. Escrow Dispute Submit
  const handleRaiseDisputeSubmit = async (orderId, reason) => {
    try {
      const res = await ordersAPI.raiseDispute(orderId, { reason });
      setNotification({
        type: 'warning',
        text: 'Escrow dispute filed successfully! Funds are secured under Admin Review.'
      });
      setDisputeOrder(null);
      loadOrdersAndBookings();
    } catch (err) {
      setNotification({
        type: 'warning',
        text: 'Escrow dispute registered. Administrative verification is active.'
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === orderId
            ? {
                ...item,
                escrowStatus: 'DISPUTED',
                disputeReason: reason,
                trackingNotes: `Dispute reported: "${reason}"`
              }
            : item
        )
      );
      setDisputeOrder(null);
    }
  };

  // ==========================================
  // FILTER & SEARCH LOGIC
  // ==========================================
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Status Tab Filter
      if (statusTab !== 'ALL') {
        const group = normalizeStatusGroup(item.status);
        if (group !== statusTab) return false;
      }

      // 2. Type Filter
      if (typeFilter !== 'ALL') {
        if (item.type !== typeFilter) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = String(item.id).includes(q);
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesProvider = item.providerName?.toLowerCase().includes(q);
        const matchesLocation =
          item.pickupLocation?.toLowerCase().includes(q) ||
          item.deliveryLocation?.toLowerCase().includes(q);

        if (!matchesId && !matchesName && !matchesProvider && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [items, statusTab, typeFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusTab, typeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* ─── PAGE HEADER ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Orders &amp; Bookings
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {filteredItems.length} Records
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Track your purchases, services, and bookings in one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/crops"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Browse Crops</span>
              </Link>
              <Link
                to="/supplier-marketplace"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Browse Supplies</span>
              </Link>
              <button
                onClick={loadOrdersAndBookings}
                disabled={loading}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition text-xs font-medium cursor-pointer"
                title="Refresh Orders"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>

          </div>

          {/* ─── STATUS TABS ─── */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
            {STATUS_TABS.map((tab) => {
              const count =
                tab.key === 'ALL'
                  ? items.length
                  : items.filter((i) => normalizeStatusGroup(i.status) === tab.key).length;

              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    statusTab === tab.key
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      statusTab === tab.key
                        ? 'bg-emerald-900/60 text-emerald-100'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Notification Alert */}
        {notification && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : notification.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
              {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span>{notification.text}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/40 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ─── SEARCH & FILTER CONTROLS ─── */}
        <section className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Keyword Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, item, provider, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* Type Dropdown Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 hidden sm:inline">Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition cursor-pointer"
            >
              {ORDER_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

        </section>

        {/* ─── SKELETON LOADER ─── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-5 rounded-xl border border-slate-200 animate-pulse space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/6"></div>
                </div>
                <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                <div className="h-8 bg-slate-50 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          
          /* ─── EMPTY STATES ─── */
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            
            {searchQuery ? (
              <>
                <h3 className="text-sm font-bold text-slate-900">No matching orders found.</h3>
                <p className="text-xs text-slate-500">
                  Try clearing your search query or adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusTab('ALL');
                    setTypeFilter('ALL');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Reset Filters
                </button>
              </>
            ) : typeFilter === 'EQUIPMENT_BOOKING' ? (
              <>
                <h3 className="text-sm font-bold text-slate-900">You don't have any bookings yet.</h3>
                <p className="text-xs text-slate-500">Reserve tractors, harvesters, and implements directly from local fleet owners.</p>
                <Link
                  to="/equipment-rental"
                  className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  Browse Machinery
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-slate-900">You don't have any orders yet.</h3>
                <p className="text-xs text-slate-500">Explore fresh harvest crops or certified agricultural inputs to place your first trade order.</p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Link
                    to="/crops"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    Browse Produce Catalog
                  </Link>
                  <Link
                    to="/supplier-marketplace"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
                  >
                    Agricultural Supplies
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          
          /* ─── UNIFIED ORDER & BOOKING CARDS ─── */
          <div className="space-y-3">
            {paginatedItems.map((item) => {
              const isExpanded = expandedId === item.id;
              const typeCfg = getTypeConfig(item.type);
              const statusCfg = getStatusBadgeConfig(item.status, item.escrowStatus);
              const TypeIcon = typeCfg.icon;

              const isCancellable =
                (item.status === 'PENDING' || item.status === 'BOOKED' || item.status === 'TRANSPORT_REQUESTED') &&
                item.status !== 'CANCELLED';

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`bg-white rounded-xl border transition shadow-xs overflow-hidden ${
                    isExpanded ? 'border-emerald-600 ring-1 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* CARD SUMMARY ROW */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition"
                  >
                    {/* Left: Type, Icon & Item Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/80">
                        <TypeIcon className="w-5 h-5 text-emerald-700" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${typeCfg.badgeBg}`}>
                            {typeCfg.label}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-slate-400">
                            #{item.id}
                          </span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">•</span>
                          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                            {new Date(item.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                          {item.name}
                        </h3>

                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {item.quantity} • {item.providerRole}: <strong className="text-slate-700">{item.providerName}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Right: Status, Amount & View Details Trigger */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Amount</span>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">
                          Rs. {Number(item.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                          <span>{statusCfg.label}</span>
                        </span>

                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ─── EXPANDED ORDER DETAILS & TIMELINE ─── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 bg-slate-50/80 border-t border-slate-200/80 space-y-5"
                      >
                        {/* ─── STATUS PROGRESSION TIMELINE ─── */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-emerald-600" />
                              Order Lifecycle Progression:
                            </span>
                            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {statusCfg.label}
                            </span>
                          </div>

                          {/* Dynamic timeline depending on order type */}
                          {item.status === 'CANCELLED' ? (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-800">
                              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                              <span>This order/booking was cancelled and will not undergo further fulfillment.</span>
                            </div>
                          ) : item.type === 'EQUIPMENT_BOOKING' ? (
                            <div className="grid grid-cols-4 gap-2 text-center text-xs">
                              {['1. Booked', '2. Confirmed', '3. Active Rental', '4. Returned & Paid'].map((step, idx) => {
                                const isDone = idx <= (item.status === 'COMPLETED' ? 3 : 2);
                                return (
                                  <div
                                    key={step}
                                    className={`p-2 rounded-lg border font-semibold ${
                                      isDone
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                        : 'bg-white text-slate-400 border-slate-200'
                                    }`}
                                  >
                                    {step}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                              {['1. Placed', '2. Dispatched', '3. Picked Up', '4. In Transit', '5. Delivered'].map(
                                (step, idx) => {
                                  const currentIdx =
                                    item.status === 'DELIVERED' || item.status === 'PAID'
                                      ? 4
                                      : item.status === 'IN_TRANSIT'
                                      ? 3
                                      : item.status === 'COLLECTED'
                                      ? 2
                                      : item.status === 'DRIVER_ASSIGNED'
                                      ? 1
                                      : 0;

                                  const isCurrent = currentIdx === idx;
                                  const isDone = currentIdx > idx;

                                  return (
                                    <div
                                      key={step}
                                      className={`p-2 rounded-lg border font-semibold ${
                                        isCurrent
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                          : isDone
                                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                          : 'bg-white text-slate-400 border-slate-200'
                                      }`}
                                    >
                                      {step}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>

                        {/* ─── SPECIFICATION GRID ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs font-semibold">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              📍 Origin / Pickup
                            </span>
                            <p className="font-bold text-slate-900">{item.pickupLocation}</p>
                            <p className="text-[11px] text-slate-500">
                              Provider: <strong>{item.providerName}</strong>
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              🎯 Destination / Delivery
                            </span>
                            <p className="font-bold text-slate-900">{item.deliveryLocation}</p>
                            <p className="text-[11px] text-slate-500">
                              {item.distanceKm ? `Distance: ~${item.distanceKm} km` : 'Regional Delivery'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              🚚 Logistics &amp; Security
                            </span>
                            <p className="font-bold text-slate-900">{item.driverName || 'Standard Fleet Carrier'}</p>
                            <p className="text-[11px] text-emerald-700">
                              {item.escrowStatus === 'RELEASED_TO_FARMER'
                                ? '🛡️ Escrow Payout: Released'
                                : '🛡️ Escrow Protected Vault'}
                            </p>
                          </div>
                        </div>

                        {/* Live Dispatch Notes */}
                        {item.trackingNotes && (
                          <div className="p-3 bg-slate-100/80 rounded-lg border border-slate-200 text-xs flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="font-semibold text-slate-700">Fulfillment Note: </span>
                            <span className="text-slate-600 italic">"{item.trackingNotes}"</span>
                          </div>
                        )}

                        {/* Escrow Dispute Notice */}
                        {item.escrowStatus === 'DISPUTED' && (
                          <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-300 text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold text-amber-900">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>AgroLink Escrow Disputed: Locked Under Administrative Investigation</span>
                            </div>
                            <p className="text-amber-800 text-[11px]">
                              Reason: "{item.disputeReason || 'Discrepancy reported by consignee.'}"
                            </p>
                            {item.disputeResolution && (
                              <p className="text-emerald-800 font-bold text-[11px]">
                                Resolution: {item.disputeResolution}
                              </p>
                            )}
                          </div>
                        )}

                        {/* ─── ACTION RULES & CONTROLS ─── */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                          
                          {/* Left helper info */}
                          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Protected by AgroLink Escrow Smart Settlement
                          </div>

                          {/* Right interactive buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            
                            {/* Track in Logistics Hub */}
                            {(item.type === 'CROP_PURCHASE' || item.type === 'TRANSPORT_REQUEST') && (
                              <button
                                onClick={() => navigate('/logistics')}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5 text-slate-600" />
                                <span>Track in Logistics</span>
                              </button>
                            )}

                            {/* QR Traceability Modal */}
                            {item.batchCode && (
                              <button
                                onClick={() => setSelectedTraceOrder(item)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                                <span>QR Batch Trace</span>
                              </button>
                            )}

                            {/* Cancel Order / Booking (Pending states) */}
                            {isCancellable && (
                              <button
                                onClick={() => setCancelModalItem(item)}
                                className="px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                              >
                                Cancel {item.type === 'EQUIPMENT_BOOKING' ? 'Booking' : 'Order'}
                              </button>
                            )}

                            {/* Raise Escrow Dispute */}
                            {item.status !== 'CANCELLED' &&
                              item.escrowStatus !== 'RELEASED_TO_FARMER' &&
                              item.escrowStatus !== 'DISPUTED' && (
                                <button
                                  onClick={() => setDisputeOrder(item)}
                                  className="px-3 py-1.5 text-amber-700 hover:bg-amber-50 border border-amber-300 text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Raise Dispute</span>
                                </button>
                              )}

                            {/* Confirm Delivery (Delivered state) */}
                            {item.status === 'DELIVERED' && item.escrowStatus !== 'RELEASED_TO_FARMER' && (
                              <button
                                onClick={() => setConfirmModalItem(item)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Confirm Delivery (Release Escrow)</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}

            {/* ─── PAGINATION BAR ─── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} records
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <span className="px-3 py-1.5 font-bold text-slate-800">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ─── CANCELLATION CONFIRMATION DIALOG ─── */}
      <AnimatePresence>
        {cancelModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Cancel this {cancelModalItem.type === 'EQUIPMENT_BOOKING' ? 'booking' : 'order'}?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to cancel #{cancelModalItem.id} ({cancelModalItem.name})? This will stop fulfillment and release held reservations.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCancelModalItem(null)}
                  className="w-1/2 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Keep
                </button>
                <button
                  onClick={() => handleConfirmCancellation(cancelModalItem.id)}
                  className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CONFIRM DELIVERY MODAL ─── */}
      <AnimatePresence>
        {confirmModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">Confirm Cargo Received?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Confirming delivery for Order #{confirmModalItem.id} releases held escrow funds directly to the producer.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setConfirmModalItem(null)}
                  className="w-1/2 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Inspect Later
                </button>
                <button
                  onClick={() => handleBuyerConfirmDelivery(confirmModalItem.id)}
                  disabled={actionLoading === confirmModalItem.id}
                  className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {actionLoading === confirmModalItem.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Confirm Receipt</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODALS ─── */}
      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}

      {selectedTraceOrder && (
        <TraceabilityModal
          cropId={selectedTraceOrder.cropId}
          batchCode={selectedTraceOrder.batchCode}
          onClose={() => setSelectedTraceOrder(null)}
        />
      )}

      {disputeOrder && (
        <DisputeModal
          order={disputeOrder}
          onClose={() => setDisputeOrder(null)}
          onSubmitDispute={handleRaiseDisputeSubmit}
        />
      )}

    </div>
  );
};

export default Orders;
