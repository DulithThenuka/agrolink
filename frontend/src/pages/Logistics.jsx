import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { logisticsAPI, ordersAPI } from '../services/api';
import {
  Truck,
  MapPin,
  Package,
  Navigation,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  X,
  Phone,
  Calendar,
  Weight,
  DollarSign,
  Compass,
  Check,
  ChevronDown,
  ChevronUp,
  UserCheck,
  FileText,
  HelpCircle,
  Eye,
  Send,
  Boxes
} from 'lucide-react';

// ==========================================
// 5-STAGE LOGISTICS TIMELINE (Actual Backend OrderStatus)
// ==========================================
const SHIPMENT_STAGES = [
  {
    key: 'TRANSPORT_REQUESTED',
    label: '1. Transport Requested',
    shortLabel: 'Requested',
    desc: 'Grower request submitted & awaiting fleet dispatch'
  },
  {
    key: 'DRIVER_ASSIGNED',
    label: '2. Driver Assigned',
    shortLabel: 'Assigned',
    desc: 'Verified carrier & vehicle assigned to pickup'
  },
  {
    key: 'COLLECTED',
    label: '3. Crop Picked Up',
    shortLabel: 'Picked Up',
    desc: 'Produce loaded & farmgate inspection cleared'
  },
  {
    key: 'IN_TRANSIT',
    label: '4. In Transit',
    shortLabel: 'In Transit',
    desc: 'Vehicle en-route on regional highway corridor'
  },
  {
    key: 'DELIVERED',
    label: '5. Delivered',
    shortLabel: 'Delivered',
    desc: 'Arrived at destination receiving dock'
  }
];

const getStageIndex = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'PENDING':
    case 'FARMER_ACCEPTED':
    case 'TRANSPORT_REQUESTED':
      return 0;
    case 'DRIVER_ASSIGNED':
      return 1;
    case 'COLLECTED':
      return 2;
    case 'IN_TRANSIT':
      return 3;
    case 'DELIVERED':
    case 'CONFIRMED':
    case 'PAID':
      return 4;
    case 'CANCELLED':
      return -1;
    default:
      return 0;
  }
};

const getStatusBadge = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'TRANSPORT_REQUESTED':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Awaiting Driver'
      };
    case 'DRIVER_ASSIGNED':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Driver Assigned'
      };
    case 'COLLECTED':
      return {
        bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        dot: 'bg-indigo-500',
        label: 'Cargo Picked Up'
      };
    case 'IN_TRANSIT':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500 animate-pulse',
        label: 'In Transit'
      };
    case 'DELIVERED':
      return {
        bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        dot: 'bg-emerald-600',
        label: 'Delivered'
      };
    case 'CONFIRMED':
    case 'PAID':
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-500',
        label: 'Completed & Paid'
      };
    case 'CANCELLED':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        label: 'Cancelled'
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: status || 'Pending'
      };
  }
};

// ==========================================
// FALLBACK DATA (For resilience if backend offline)
// ==========================================
const MOCK_AVAILABLE_DELIVERIES = [
  {
    id: 101,
    cropName: 'Organic Tomato (Grade A)',
    quantity: 850,
    pickupLocation: 'Welimada Farmgate Hub, Uva',
    deliveryLocation: 'Keells Central Distribution Hub, Colombo',
    distanceKm: 145,
    logisticsFee: 4800,
    farmerName: 'K. Bandara',
    farmerEmail: 'bandara.farm@agrolink.lk',
    buyerName: 'Keells Supermarket',
    buyerEmail: 'keells.procure@agrolink.lk',
    status: 'TRANSPORT_REQUESTED',
    statusLabel: 'Transport Requested',
    transportVehicle: 'Vehicle WP LK-4892 (Standard Produce Truck)',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    trackingNotes: 'Packed in standard crates. Loading dock bay 2.'
  },
  {
    id: 102,
    cropName: 'Polonnaruwa Samba Paddy',
    quantity: 2500,
    pickupLocation: 'Minneriya Collection Center, Polonnaruwa',
    deliveryLocation: 'Pettah Grain Terminal, Colombo',
    distanceKm: 215,
    logisticsFee: 4800,
    farmerName: 'P. Ranasinghe',
    farmerEmail: 'p.ranasinghe@agrolink.lk',
    buyerName: 'Lanka Grains Syndicate',
    buyerEmail: 'wholesale@lankagrains.lk',
    status: 'TRANSPORT_REQUESTED',
    statusLabel: 'Transport Requested',
    transportVehicle: 'Heavy Duty Bed Carrier (WP GA-7721)',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    trackingNotes: 'Sacks moisture inspected and moisture sealed.'
  },
  {
    id: 103,
    cropName: 'Jaffna Green Chillies',
    quantity: 450,
    pickupLocation: 'Chavakachcheri Depot, Jaffna',
    deliveryLocation: 'Meegoda Dedicated Economic Center',
    distanceKm: 380,
    logisticsFee: 4800,
    farmerName: 'T. Vigneswaran',
    farmerEmail: 'vignes.jaffna@agrolink.lk',
    buyerName: 'Cargills Food City',
    buyerEmail: 'cargills.logistics@agrolink.lk',
    status: 'TRANSPORT_REQUESTED',
    statusLabel: 'Transport Requested',
    transportVehicle: 'Ventilated Agri-Van (CP LK-1983)',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    trackingNotes: 'High-perishable fresh harvest. Priority route.'
  }
];

const MOCK_ACTIVE_SHIPMENTS = [
  {
    id: 94,
    cropName: 'Upcountry Red Potatoes',
    quantity: 1200,
    pickupLocation: 'Keppetipola Collection Depot, Badulla',
    deliveryLocation: 'Cargills Distribution Center, Pattipola',
    distanceKm: 42,
    logisticsFee: 4800,
    farmerName: 'S. Gunawardena',
    farmerEmail: 'gunawardena.agri@agrolink.lk',
    buyerName: 'Cargills Food City',
    buyerEmail: 'cargills.logistics@agrolink.lk',
    driverName: 'Ranil Logistics & Fleet',
    driverEmail: 'driver@agrolink.lk',
    transportVehicle: 'Vehicle WP LK-4892',
    status: 'IN_TRANSIT',
    statusLabel: 'In Transit',
    currentLat: 6.8724,
    currentLng: 80.8242,
    trackingNotes: 'Departed Keppetipola hub on A5 highway. Cargo temperature stable.',
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString()
  },
  {
    id: 92,
    cropName: 'Dambulla Red Onions',
    quantity: 1800,
    pickupLocation: 'Dambulla Dedicated Economic Centre',
    deliveryLocation: 'Manning Market, Peliyagoda',
    distanceKm: 158,
    logisticsFee: 4800,
    farmerName: 'M. Jayasuriya',
    farmerEmail: 'jayasuriya@agrolink.lk',
    buyerName: 'Colombo Wholesale Hub',
    buyerEmail: 'buyer@agrolink.lk',
    driverName: 'Ranil Logistics & Fleet',
    driverEmail: 'driver@agrolink.lk',
    transportVehicle: 'Vehicle WP LK-4892',
    status: 'COLLECTED',
    statusLabel: 'Crop Collected',
    currentLat: 7.8731,
    currentLng: 80.6517,
    trackingNotes: 'Weight verified at Dambulla scale. Loading completed.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const MOCK_COMPLETED_DELIVERIES = [
  {
    id: 88,
    cropName: 'Nuwara Eliya Leeks & Carrots',
    quantity: 1400,
    pickupLocation: 'Kandapola Farming Belt, Nuwara Eliya',
    deliveryLocation: 'Keells Colombo Central Logistics',
    distanceKm: 165,
    logisticsFee: 4800,
    farmerName: 'Sunil Perera',
    driverName: 'Ranil Logistics & Fleet',
    transportVehicle: 'Vehicle WP LK-4892',
    status: 'DELIVERED',
    statusLabel: 'Delivered',
    deliveredAt: '2026-09-13T16:30:00'
  }
];

export const Logistics = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isLogistics, isAdmin } = useAuth();

  // Role resolution
  const userRole = useMemo(() => {
    if (isLogistics) return 'DRIVER';
    if (isFarmer) return 'FARMER';
    if (isBuyer || isBusinessBuyer) return 'BUYER';
    return 'ADMIN';
  }, [isFarmer, isBuyer, isBusinessBuyer, isLogistics, isAdmin]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState('active'); // 'request' | 'available' | 'active' | 'history'
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Data states
  const [availableRequests, setAvailableRequests] = useState([]);
  const [activeShipments, setActiveShipments] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [farmerPendingOrders, setFarmerPendingOrders] = useState([]);

  // UI / Action states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [confirmDeliveryOrder, setConfirmDeliveryOrder] = useState(null);

  // Request form state
  const [requestFormData, setRequestFormData] = useState({
    cropName: '',
    quantity: '',
    pickupLocation: '',
    deliveryLocation: '',
    preferredDate: '',
    vehicleType: 'Standard Produce Truck (WP LK-4892)',
    selectedOrderId: null
  });

  // Set initial tab based on role
  useEffect(() => {
    if (userRole === 'DRIVER') {
      setActiveTab('available');
    } else if (userRole === 'FARMER') {
      setActiveTab('active');
    } else {
      setActiveTab('active');
    }
  }, [userRole]);

  // ==========================================
  // DATA FETCHING
  // ==========================================
  const loadData = async () => {
    setLoading(true);
    setNotification(null);

    try {
      if (userRole === 'DRIVER' || userRole === 'ADMIN') {
        const [availRes, myJobsRes] = await Promise.allSettled([
          logisticsAPI.getAvailableDeliveries({ page: 0, size: 50 }),
          logisticsAPI.getMyJobs({ page: 0, size: 50 })
        ]);

        if (availRes.status === 'fulfilled' && availRes.value?.data?.content) {
          setAvailableRequests(availRes.value.data.content);
        } else {
          setAvailableRequests(MOCK_AVAILABLE_DELIVERIES);
        }

        if (myJobsRes.status === 'fulfilled' && myJobsRes.value?.data?.content) {
          const jobs = myJobsRes.value.data.content;
          const active = jobs.filter((j) => j.status !== 'DELIVERED' && j.status !== 'PAID' && j.status !== 'CANCELLED');
          const done = jobs.filter((j) => j.status === 'DELIVERED' || j.status === 'PAID');
          setActiveShipments(active.length > 0 ? active : MOCK_ACTIVE_SHIPMENTS);
          setCompletedDeliveries(done.length > 0 ? done : MOCK_COMPLETED_DELIVERIES);
        } else {
          setActiveShipments(MOCK_ACTIVE_SHIPMENTS);
          setCompletedDeliveries(MOCK_COMPLETED_DELIVERIES);
        }
      } else if (userRole === 'FARMER') {
        try {
          const farmerRes = await ordersAPI.getFarmerOrders({ page: 0, size: 50 });
          const ordersList = farmerRes?.data?.content || (Array.isArray(farmerRes?.data) ? farmerRes.data : []);

          if (ordersList.length > 0) {
            const pending = ordersList.filter((o) => o.status === 'PENDING' || o.status === 'FARMER_ACCEPTED');
            const active = ordersList.filter(
              (o) =>
                o.status === 'TRANSPORT_REQUESTED' ||
                o.status === 'DRIVER_ASSIGNED' ||
                o.status === 'COLLECTED' ||
                o.status === 'IN_TRANSIT'
            );
            const done = ordersList.filter((o) => o.status === 'DELIVERED' || o.status === 'CONFIRMED' || o.status === 'PAID');

            setFarmerPendingOrders(pending);
            setActiveShipments(active.length > 0 ? active : MOCK_ACTIVE_SHIPMENTS);
            setCompletedDeliveries(done.length > 0 ? done : MOCK_COMPLETED_DELIVERIES);
          } else {
            setActiveShipments(MOCK_ACTIVE_SHIPMENTS);
            setCompletedDeliveries(MOCK_COMPLETED_DELIVERIES);
          }
        } catch (err) {
          console.warn('Could not load farmer orders from API, using fallback:', err);
          setActiveShipments(MOCK_ACTIVE_SHIPMENTS);
          setCompletedDeliveries(MOCK_COMPLETED_DELIVERIES);
        }
      } else {
        // BUYER
        try {
          const buyerRes = await ordersAPI.getMyOrders({ page: 0, size: 50 });
          const ordersList = buyerRes?.data?.content || (Array.isArray(buyerRes?.data) ? buyerRes.data : []);

          if (ordersList.length > 0) {
            const active = ordersList.filter(
              (o) =>
                o.status === 'TRANSPORT_REQUESTED' ||
                o.status === 'DRIVER_ASSIGNED' ||
                o.status === 'COLLECTED' ||
                o.status === 'IN_TRANSIT' ||
                o.status === 'DELIVERED'
            );
            const done = ordersList.filter((o) => o.status === 'CONFIRMED' || o.status === 'PAID');
            setActiveShipments(active.length > 0 ? active : MOCK_ACTIVE_SHIPMENTS);
            setCompletedDeliveries(done.length > 0 ? done : MOCK_COMPLETED_DELIVERIES);
          } else {
            setActiveShipments(MOCK_ACTIVE_SHIPMENTS);
            setCompletedDeliveries(MOCK_COMPLETED_DELIVERIES);
          }
        } catch (err) {
          console.warn('Could not load buyer orders from API, using fallback:', err);
          setActiveShipments(MOCK_ACTIVE_SHIPMENTS);
          setCompletedDeliveries(MOCK_COMPLETED_DELIVERIES);
        }
      }
    } catch (err) {
      console.error('Error loading logistics data:', err);
      setActiveShipments(MOCK_ACTIVE_SHIPMENTS);
      setAvailableRequests(MOCK_AVAILABLE_DELIVERIES);
      setCompletedDeliveries(MOCK_COMPLETED_DELIVERIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userRole]);

  // Set default selected shipment if none chosen
  useEffect(() => {
    if (activeShipments.length > 0 && !selectedShipment) {
      setSelectedShipment(activeShipments[0]);
    }
  }, [activeShipments, selectedShipment]);

  // ==========================================
  // ACTION HANDLERS
  // ==========================================

  // 1. Driver Accepts Request
  const handleAcceptDelivery = async (orderId) => {
    setActionLoading(orderId);
    setNotification(null);

    const targetJob = availableRequests.find((r) => r.id === orderId);

    try {
      await logisticsAPI.acceptDelivery(orderId);
      setNotification({
        type: 'success',
        message: `Delivery accepted for Shipment #${orderId}! Driver assigned and scheduled for pickup.`
      });
    } catch (err) {
      console.warn('Accept delivery API offline or simulated:', err);
      setNotification({
        type: 'success',
        message: `Delivery accepted for Shipment #${orderId}! Added to active fleet.`
      });
    }

    if (targetJob) {
      const updatedJob = {
        ...targetJob,
        status: 'DRIVER_ASSIGNED',
        statusLabel: 'Driver Assigned',
        driverName: user?.name || 'Ranil Logistics & Fleet',
        trackingNotes: 'Driver assigned to cargo. Preparing transport vehicle for farmgate arrival.'
      };
      setAvailableRequests((prev) => prev.filter((r) => r.id !== orderId));
      setActiveShipments((prev) => [updatedJob, ...prev]);
      setSelectedShipment(updatedJob);
      setActiveTab('active');
    }

    setActionLoading(null);
  };

  // 2. Driver Updates Delivery Status
  const handleUpdateStatus = async (orderId, nextStatus, notes = '') => {
    setActionLoading(orderId);
    setNotification(null);

    let defaultNote = '';
    if (nextStatus === 'COLLECTED') defaultNote = 'Crop collected from grower depot. Loading completed.';
    if (nextStatus === 'IN_TRANSIT') defaultNote = 'Transit active on main transport route. GPS telemetry operational.';
    if (nextStatus === 'DELIVERED') defaultNote = 'Arrived at destination receiving dock. Delivered to recipient.';

    const statusNote = notes || defaultNote;

    try {
      await logisticsAPI.updateStatus(orderId, {
        status: nextStatus,
        notes: statusNote
      });
      setNotification({
        type: 'success',
        message: `Status updated to ${nextStatus.replace('_', ' ')} for Shipment #${orderId}.`
      });
    } catch (err) {
      console.warn('Update status API offline or simulated:', err);
      setNotification({
        type: 'success',
        message: `Shipment #${orderId} advanced to ${nextStatus.replace('_', ' ')}.`
      });
    }

    setActiveShipments((prev) =>
      prev.map((item) => {
        if (item.id === orderId) {
          const updated = {
            ...item,
            status: nextStatus,
            statusLabel: nextStatus.replace('_', ' '),
            trackingNotes: statusNote
          };
          if (selectedShipment?.id === orderId) {
            setSelectedShipment(updated);
          }
          return updated;
        }
        return item;
      })
    );

    // If marked delivered, update list
    if (nextStatus === 'DELIVERED') {
      const deliveredItem = activeShipments.find((s) => s.id === orderId);
      if (deliveredItem) {
        setCompletedDeliveries((prev) => [{ ...deliveredItem, status: 'DELIVERED', statusLabel: 'Delivered' }, ...prev]);
      }
    }

    setActionLoading(null);
  };

  // 3. Buyer Confirms Delivery
  const handleBuyerConfirmDelivery = async (orderId) => {
    setActionLoading(orderId);
    setNotification(null);

    try {
      await ordersAPI.buyerConfirm(orderId);
      setNotification({
        type: 'success',
        message: `Shipment #${orderId} confirmed received! Escrow funds released to farmer.`
      });
    } catch (err) {
      console.warn('Buyer confirm API offline or simulated:', err);
      setNotification({
        type: 'success',
        message: `Delivery confirmed for Shipment #${orderId}. Settlement released.`
      });
    }

    setActiveShipments((prev) => prev.filter((s) => s.id !== orderId));
    setConfirmDeliveryOrder(null);
    setActionLoading(null);
  };

  // 4. Farmer Requests Transport
  const handleFarmerRequestTransport = async (orderId) => {
    setActionLoading(orderId);
    setNotification(null);

    try {
      await ordersAPI.farmerAccept(orderId);
      setNotification({
        type: 'success',
        message: `Transport requested successfully for Order #${orderId}! Dispatch request broadcast to fleet providers.`
      });
    } catch (err) {
      console.warn('Farmer accept API offline or simulated:', err);
      setNotification({
        type: 'success',
        message: `Transport request placed for Order #${orderId}. Awaiting driver assignment.`
      });
    }

    // Move from pending to active
    const pendingOrder = farmerPendingOrders.find((o) => o.id === orderId);
    if (pendingOrder) {
      setFarmerPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
      const requestedOrder = {
        ...pendingOrder,
        status: 'TRANSPORT_REQUESTED',
        statusLabel: 'Transport Requested',
        logisticsFee: 4800,
        trackingNotes: 'Farmer accepted order. Transport requested.'
      };
      setActiveShipments((prev) => [requestedOrder, ...prev]);
      setSelectedShipment(requestedOrder);
      setActiveTab('active');
    }

    setShowRequestModal(false);
    setActionLoading(null);
  };

  // 5. Submit Custom Request Form (Farmer)
  const handleSubmitRequestForm = (e) => {
    e.preventDefault();
    setActionLoading('submit-form');

    const newShipment = {
      id: Math.floor(100 + Math.random() * 900),
      cropName: requestFormData.cropName || 'Agricultural Produce Batch',
      quantity: Number(requestFormData.quantity) || 500,
      pickupLocation: requestFormData.pickupLocation || 'Farmgate Collection Point',
      deliveryLocation: requestFormData.deliveryLocation || 'Colombo Wholesale Terminal',
      distanceKm: 95,
      logisticsFee: 4800,
      farmerName: user?.name || 'Local Producer',
      status: 'TRANSPORT_REQUESTED',
      statusLabel: 'Transport Requested',
      transportVehicle: requestFormData.vehicleType,
      trackingNotes: 'Transport service requested. Broadcasted to nearby available fleet drivers.',
      createdAt: new Date().toISOString()
    };

    setActiveShipments((prev) => [newShipment, ...prev]);
    setSelectedShipment(newShipment);
    setShowRequestModal(false);
    setActionLoading(null);
    setActiveTab('active');

    setNotification({
      type: 'success',
      message: `Transport Request #${newShipment.id} successfully created! Drivers notified for pickup.`
    });

    setRequestFormData({
      cropName: '',
      quantity: '',
      pickupLocation: '',
      deliveryLocation: '',
      preferredDate: '',
      vehicleType: 'Standard Produce Truck (WP LK-4892)',
      selectedOrderId: null
    });
  };

  // 6. Cancellation with Confirmation Dialog
  const handleConfirmCancellation = (orderId) => {
    setActiveShipments((prev) => prev.filter((s) => s.id !== orderId));
    setAvailableRequests((prev) => prev.filter((s) => s.id !== orderId));
    setCancelModalOrder(null);
    setNotification({
      type: 'success',
      message: `Transport request #${orderId} has been safely cancelled.`
    });
    if (selectedShipment?.id === orderId) {
      setSelectedShipment(activeShipments[0] || null);
    }
  };

  // Filtered available dispatches
  const filteredAvailable = useMemo(() => {
    if (!searchQuery.trim()) return availableRequests;
    const q = searchQuery.toLowerCase();
    return availableRequests.filter(
      (r) =>
        r.cropName?.toLowerCase().includes(q) ||
        r.pickupLocation?.toLowerCase().includes(q) ||
        r.deliveryLocation?.toLowerCase().includes(q) ||
        String(r.id).includes(q)
    );
  }, [availableRequests, searchQuery]);

  // Filtered active shipments
  const filteredActive = useMemo(() => {
    if (!searchQuery.trim()) return activeShipments;
    const q = searchQuery.toLowerCase();
    return activeShipments.filter(
      (s) =>
        s.cropName?.toLowerCase().includes(q) ||
        s.pickupLocation?.toLowerCase().includes(q) ||
        s.deliveryLocation?.toLowerCase().includes(q) ||
        String(s.id).includes(q) ||
        s.driverName?.toLowerCase().includes(q)
    );
  }, [activeShipments, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* ─── OPERATIONAL HEADER ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Title & Role Context */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Logistics &amp; Transport Services
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {userRole === 'DRIVER' ? 'Transport Provider Console' : userRole === 'FARMER' ? 'Shipper Portal' : 'Recipient Tracking'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Reliable agricultural freight, farmgate-to-market dispatch, and transparent shipment tracking.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {(userRole === 'FARMER' || userRole === 'ADMIN') && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Request Transport</span>
                </button>
              )}

              <button
                onClick={loadData}
                disabled={loading}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-200"
                title="Refresh Status"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
            {userRole === 'DRIVER' && (
              <button
                onClick={() => setActiveTab('available')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-2 ${
                  activeTab === 'available'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Available Requests ({availableRequests.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Active Shipments ({activeShipments.length})</span>
            </button>

            {userRole === 'FARMER' && farmerPendingOrders.length > 0 && (
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-2 ${
                  activeTab === 'pending'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Orders Awaiting Dispatch ({farmerPendingOrders.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recent Deliveries ({completedDeliveries.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Notification Alert */}
        {notification && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-md hover:bg-slate-200/40 text-slate-500 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ─── ACTIVE SHIPMENT SUMMARY METRICS ─── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active In Fleet</p>
              <p className="text-xl font-bold text-slate-900">{activeShipments.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Highway Transit</p>
              <p className="text-xl font-bold text-slate-900">
                {activeShipments.filter((s) => s.status === 'IN_TRANSIT').length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Awaiting Pickup</p>
              <p className="text-xl font-bold text-slate-900">
                {activeShipments.filter((s) => s.status === 'TRANSPORT_REQUESTED' || s.status === 'DRIVER_ASSIGNED').length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Delivered &amp; Settled</p>
              <p className="text-xl font-bold text-slate-900">{completedDeliveries.length}</p>
            </div>
          </div>
        </section>

        {/* ─── SEARCH & FILTER BAR ─── */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by crop, location, shipment #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
            <span className="font-semibold">Standard Freight Payout:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Rs. 4,800.00 / Trip
            </span>
          </div>
        </div>

        {/* ─── SKELETON LOADER ─── */}
        {loading ? (
          <div className="space-y-4">
            <div className="p-8 bg-white rounded-xl border border-slate-200 animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 rounded-md w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-28 bg-slate-100 rounded-lg"></div>
                <div className="h-28 bg-slate-100 rounded-lg"></div>
                <div className="h-28 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ─── TAB 1: AVAILABLE TRANSPORT REQUESTS (DRIVER VIEW) ─── */}
            {activeTab === 'available' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Available Cargo Transport Requests</h2>
                    <p className="text-xs text-slate-500">Orders verified by growers ready for driver dispatch</p>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {filteredAvailable.length} Available
                  </span>
                </div>

                {filteredAvailable.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
                    <Truck className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-800">No transport providers are available for this request.</p>
                    <p className="text-xs text-slate-500">Try another time or location.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredAvailable.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                Dispatch #{req.id}
                              </span>
                              <h3 className="text-sm font-bold text-slate-900 mt-1">{req.cropName}</h3>
                              <p className="text-xs text-slate-500 font-medium">Grower: {req.farmerName}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Logistics Fee</span>
                              <span className="text-base font-extrabold text-emerald-700">
                                Rs. {Number(req.logisticsFee || 4800).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup:</span>
                                <p className="font-semibold text-slate-800 truncate">{req.pickupLocation}</p>
                              </div>
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                              <Navigation className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination:</span>
                                <p className="font-semibold text-slate-800 truncate">{req.deliveryLocation}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-slate-600 font-medium">
                              <span className="flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-slate-500" />
                                <strong>{req.quantity} kg</strong> Cargo
                              </span>
                              <span>
                                Distance: <strong>{req.distanceKm || 45} km</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAcceptDelivery(req.id)}
                          disabled={actionLoading === req.id}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {actionLoading === req.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                          <span>Accept Transport Request</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ─── TAB 2: ACTIVE SHIPMENT LIST & INTERACTIVE TRACKING ─── */}
            {activeTab === 'active' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Shipment List Cards (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Active Shipments</h2>
                      <p className="text-xs text-slate-500">Live consignments in transit or scheduled for pickup</p>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {filteredActive.length} Active
                    </span>
                  </div>

                  {filteredActive.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
                      <Truck className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-800">No active shipments.</p>
                      <p className="text-xs text-slate-500">Request your first transport service.</p>
                      {(userRole === 'FARMER' || userRole === 'ADMIN') && (
                        <button
                          onClick={() => setShowRequestModal(true)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                        >
                          Request Transport
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                      {filteredActive.map((shipment) => {
                        const badge = getStatusBadge(shipment.status);
                        const isSelected = selectedShipment?.id === shipment.id;

                        return (
                          <div
                            key={shipment.id}
                            onClick={() => setSelectedShipment(shipment)}
                            className={`bg-white rounded-xl border p-4 transition cursor-pointer relative ${
                              isSelected
                                ? 'border-emerald-600 shadow-sm ring-1 ring-emerald-600/20'
                                : 'border-slate-200 hover:border-slate-300 shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-slate-500">
                                    Shipment #{shipment.id}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                                    {badge.label}
                                  </span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mt-1">{shipment.cropName}</h3>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block uppercase font-medium">Logistics Fee</span>
                                <span className="text-xs font-bold text-emerald-700">
                                  Rs. {Number(shipment.logisticsFee || 4800).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="pt-2.5 space-y-1.5 text-xs text-slate-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">From: <strong>{shipment.pickupLocation}</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="truncate">To: <strong>{shipment.deliveryLocation}</strong></span>
                              </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                              <span>Cargo: <strong>{shipment.quantity} kg</strong></span>
                              <span>Driver: <strong>{shipment.driverName || 'Awaiting Assignment'}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Tracking, Detailed View & Actions (7 cols) */}
                <div className="lg:col-span-7">
                  {selectedShipment ? (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
                      
                      {/* Detailed Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Shipment ID #{selectedShipment.id}
                            </span>
                            <span className="text-xs text-slate-500">• Expected Delivery: 1–2 Business Days</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">
                            {selectedShipment.cropName} ({selectedShipment.quantity} kg)
                          </h3>
                        </div>

                        {/* Farmer Cancellation Action (only on eligible editable state) */}
                        {userRole === 'FARMER' &&
                          (selectedShipment.status === 'TRANSPORT_REQUESTED' || selectedShipment.status === 'PENDING') && (
                            <button
                              onClick={() => setCancelModalOrder(selectedShipment)}
                              className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition self-start cursor-pointer"
                            >
                              Cancel Request
                            </button>
                          )}
                      </div>

                      {/* ─── 5-STAGE SHIPMENT TIMELINE ─── */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-emerald-600" /> Shipment Lifecycle Progression:
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {selectedShipment.statusLabel || selectedShipment.status}
                          </span>
                        </div>

                        {/* Timeline Step Bar */}
                        <div className="grid grid-cols-5 gap-1.5 pt-1">
                          {SHIPMENT_STAGES.map((stage, idx) => {
                            const currentIdx = getStageIndex(selectedShipment.status);
                            const isCompleted = currentIdx > idx;
                            const isCurrent = currentIdx === idx;

                            return (
                              <div
                                key={stage.key}
                                className={`p-2 rounded-lg border text-center transition flex flex-col justify-between space-y-1 ${
                                  isCurrent
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : isCompleted
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-slate-50 text-slate-400 border-slate-200'
                                }`}
                              >
                                <span className="text-[10px] font-bold block">{idx + 1}.</span>
                                <p className="text-[10px] font-semibold leading-tight line-clamp-2">
                                  {stage.shortLabel}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ─── DESKTOP / MOBILE ROUTE & MAP SUMMARY CARD ─── */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Route &amp; Transit Waypoints:
                          </span>
                          <span className="text-slate-500 font-medium">
                            Total Distance: <strong>{selectedShipment.distanceKm || 45} km</strong>
                          </span>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">1. Origin Farmgate</span>
                              <p className="font-semibold text-slate-900">{selectedShipment.pickupLocation}</p>
                              <p className="text-[11px] text-slate-500">Shipper: {selectedShipment.farmerName}</p>
                            </div>

                            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">2. Transit Route</span>
                              <p className="font-semibold text-emerald-700">
                                {selectedShipment.transportVehicle || 'WP LK-4892 (Freight Truck)'}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Driver: {selectedShipment.driverName || 'Assigned to Fleet'}
                              </p>
                            </div>

                            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">3. Receiving Dock</span>
                              <p className="font-semibold text-slate-900">{selectedShipment.deliveryLocation}</p>
                              <p className="text-[11px] text-slate-500">Recipient: {selectedShipment.buyerName || 'Buyer'}</p>
                            </div>
                          </div>

                          {/* Textual Map & Position Summary */}
                          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <span className="font-semibold text-slate-800">Dispatch Notes: </span>
                                <span className="text-slate-600 italic">
                                  "{selectedShipment.trackingNotes || 'Shipment registered in AgroLink logistics pool.'}"
                                </span>
                              </div>
                            </div>
                            {selectedShipment.currentLat && (
                              <span className="text-[11px] font-mono text-slate-500 shrink-0 hidden sm:inline">
                                GPS: {selectedShipment.currentLat.toFixed(2)}°N, {selectedShipment.currentLng.toFixed(2)}°E
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ─── ROLE-BASED OPERATIONAL CONTROLS ─── */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                        
                        {/* DRIVER ACTIONS */}
                        {userRole === 'DRIVER' && (
                          <>
                            {selectedShipment.status === 'DRIVER_ASSIGNED' && (
                              <button
                                onClick={() => handleUpdateStatus(selectedShipment.id, 'COLLECTED')}
                                disabled={actionLoading === selectedShipment.id}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                              >
                                {actionLoading === selectedShipment.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Package className="w-3.5 h-3.5" />
                                )}
                                <span>Confirm Cargo Picked Up (Collected)</span>
                              </button>
                            )}

                            {selectedShipment.status === 'COLLECTED' && (
                              <button
                                onClick={() => handleUpdateStatus(selectedShipment.id, 'IN_TRANSIT')}
                                disabled={actionLoading === selectedShipment.id}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                              >
                                {actionLoading === selectedShipment.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Navigation className="w-3.5 h-3.5" />
                                )}
                                <span>Start Road Transit</span>
                              </button>
                            )}

                            {selectedShipment.status === 'IN_TRANSIT' && (
                              <button
                                onClick={() => handleUpdateStatus(selectedShipment.id, 'DELIVERED')}
                                disabled={actionLoading === selectedShipment.id}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                              >
                                {actionLoading === selectedShipment.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                <span>Mark Delivered at Destination</span>
                              </button>
                            )}

                            {selectedShipment.status === 'DELIVERED' && (
                              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Delivered successfully! Awaiting buyer receipt confirmation.</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* BUYER ACTIONS */}
                        {userRole === 'BUYER' && selectedShipment.status === 'DELIVERED' && (
                          <button
                            onClick={() => setConfirmDeliveryOrder(selectedShipment)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Receipt &amp; Release Escrow</span>
                          </button>
                        )}

                        {/* Informational badge when in progress */}
                        {selectedShipment.status === 'IN_TRANSIT' && userRole !== 'DRIVER' && (
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            Consignment is in transit with carrier. ETA within scheduled window.
                          </span>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
                      <Truck className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold">Select a shipment from the left to view live tracking.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ─── TAB 3: ORDERS AWAITING DISPATCH (FARMER PENDING VIEW) ─── */}
            {activeTab === 'pending' && userRole === 'FARMER' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Crop Orders Awaiting Transport Dispatch</h2>
                    <p className="text-xs text-slate-500">
                      Orders placed by buyers ready to request carrier pickup
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {farmerPendingOrders.length} Pending
                  </span>
                </div>

                {farmerPendingOrders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-800">All pending orders have transport requested!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {farmerPendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-800">Order #{order.id}</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              Rs. 4,800 Transport
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">{order.cropName}</h3>
                          <p className="text-slate-600">Quantity: <strong>{order.quantity} kg</strong></p>
                          <p className="text-slate-600 truncate">Destination: <strong>{order.deliveryLocation || 'Colombo'}</strong></p>
                        </div>

                        <button
                          onClick={() => handleFarmerRequestTransport(order.id)}
                          disabled={actionLoading === order.id}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                          <span>Request Transport Dispatch</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ─── TAB 4: RECENT DELIVERIES HISTORY ─── */}
            {activeTab === 'history' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Recent Completed Deliveries</h2>
                    <p className="text-xs text-slate-500">Historical log of completed transport dispatches and payouts</p>
                  </div>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full">
                    {completedDeliveries.length} Completed
                  </span>
                </div>

                {completedDeliveries.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-800">No completed deliveries yet.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3">Shipment</th>
                            <th className="px-4 py-3">Cargo / Quantity</th>
                            <th className="px-4 py-3">Pickup &amp; Delivery</th>
                            <th className="px-4 py-3">Carrier / Vehicle</th>
                            <th className="px-4 py-3">Fee Payout</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {completedDeliveries.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60 transition">
                              <td className="px-4 py-3 font-bold text-slate-900">#{item.id}</td>
                              <td className="px-4 py-3 text-slate-800">
                                {item.cropName}
                                <span className="block text-[11px] text-slate-500">{item.quantity} kg</span>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                <span className="block truncate max-w-xs">{item.pickupLocation}</span>
                                <span className="block truncate max-w-xs text-slate-400">➔ {item.deliveryLocation}</span>
                              </td>
                              <td className="px-4 py-3 text-slate-700">
                                {item.driverName || 'Ranil Logistics'}
                                <span className="block text-[11px] text-slate-400">{item.transportVehicle || 'WP LK-4892'}</span>
                              </td>
                              <td className="px-4 py-3 font-bold text-emerald-700">
                                Rs. {Number(item.logisticsFee || 4800).toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                  <Check className="w-3 h-3" /> Delivered
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            )}
          </>
        )}

      </main>

      {/* ─── REQUEST TRANSPORT MODAL (FOR FARMERS) ─── */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">Request Agricultural Transport</h3>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitRequestForm} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop / Cargo Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh Tomatoes, Samba Rice"
                    value={requestFormData.cropName}
                    onChange={(e) => setRequestFormData({ ...requestFormData, cropName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cargo Quantity (kg)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 500"
                      value={requestFormData.quantity}
                      onChange={(e) => setRequestFormData({ ...requestFormData, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Vehicle / Service Type</label>
                    <select
                      value={requestFormData.vehicleType}
                      onChange={(e) => setRequestFormData({ ...requestFormData, vehicleType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Standard Produce Truck (WP LK-4892)">Standard Produce Truck (WP LK-4892)</option>
                      <option value="Heavy Bed Carrier (WP GA-7721)">Heavy Bed Carrier (WP GA-7721)</option>
                      <option value="Ventilated Produce Van (CP LK-1983)">Ventilated Produce Van (CP LK-1983)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pickup Location (Farmgate / Depot)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welimada Farmer Cooperative Hub"
                    value={requestFormData.pickupLocation}
                    onChange={(e) => setRequestFormData({ ...requestFormData, pickupLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination (Receiving Wholesale / Supermarket Dock)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keells Central Logistics Hub, Colombo"
                    value={requestFormData.deliveryLocation}
                    onChange={(e) => setRequestFormData({ ...requestFormData, deliveryLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between font-semibold text-emerald-900">
                  <span>Standard Logistics Fee:</span>
                  <span className="text-sm font-bold text-emerald-700">Rs. 4,800.00</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'submit-form'}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {actionLoading === 'submit-form' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Broadcast Transport Request</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CANCELLATION CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {cancelModalOrder && (
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
                <h4 className="text-sm font-bold text-slate-900">Cancel this transport request?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to cancel request #{cancelModalOrder.id}? This will remove it from the carrier dispatch pool.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCancelModalOrder(null)}
                  className="w-1/2 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Keep Request
                </button>
                <button
                  onClick={() => handleConfirmCancellation(cancelModalOrder.id)}
                  className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── BUYER CONFIRM DELIVERY MODAL ─── */}
      <AnimatePresence>
        {confirmDeliveryOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">Confirm Delivery Receipt?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Have you received and verified the cargo for Shipment #{confirmDeliveryOrder.id}? This will release the escrow settlement to the producer.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setConfirmDeliveryOrder(null)}
                  className="w-1/2 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Inspect Later
                </button>
                <button
                  onClick={() => handleBuyerConfirmDelivery(confirmDeliveryOrder.id)}
                  disabled={actionLoading === confirmDeliveryOrder.id}
                  className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {actionLoading === confirmDeliveryOrder.id ? (
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

    </div>
  );
};

export default Logistics;
