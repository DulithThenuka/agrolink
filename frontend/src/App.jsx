import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CropsList } from './pages/CropsList';
import { CropDetails } from './pages/CropDetails';
import { AddCrop } from './pages/AddCrop';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { CropAdvisor } from './pages/CropAdvisor';
import { PricePrediction } from './pages/PricePrediction';
import { DemandForecasting } from './pages/DemandForecasting';
import { CropDiseaseDetection } from './pages/CropDiseaseDetection';
import { TradeNegotiation } from './pages/TradeNegotiation';
import { ContractFarming } from './pages/ContractFarming';
import { Orders } from './pages/Orders';
import { Logistics } from './pages/Logistics';
import { Profile } from './pages/Profile';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { ExpertModule } from './pages/ExpertModule';
import { SupplierMarketplace } from './pages/SupplierMarketplace';
import { EquipmentRental } from './pages/EquipmentRental';
import { CommunityPlatform } from './pages/CommunityPlatform';
import { AgroLinkAiAssistant } from './pages/AgroLinkAiAssistant';
import { GovernmentIntelligence } from './pages/GovernmentIntelligence';
import { WasteReductionModule } from './pages/WasteReductionModule';

/**
 * ProtectedRoute — guards a route behind authentication and optional role restrictions.
 *
 * Props:
 *   allowedRoles: string[]  — if provided, only users whose role is in the list (or ADMIN) can access.
 *                             Pass an empty array / omit for "any authenticated user".
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const {
    isAuthenticated,
    isFarmer, isBuyer, isBusinessBuyer,
    isLogistics, isExpert, isSupplier, isAdmin,
    user,
  } = useAuth();
  const location = useLocation();

  // 1. Must be logged in
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. If no role restriction, any authenticated user is fine
  if (allowedRoles.length === 0) return children;

  // 3. Admins can always access everything
  if (isAdmin) return children;

  // 4. Build a set of the current user's role strings for O(1) lookup
  const userRoles = new Set([user?.role, user?.role?.replace('ROLE_', '')]);

  // 5. Check if the user's role is in the allowed list
  const hasAccess = allowedRoles.some((r) => userRoles.has(r));

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <Navbar />

      <div className="flex flex-1 w-full">
        {showSidebar && <Sidebar />}

        <main className={`flex-1 overflow-x-hidden min-h-[calc(100vh-140px)] ${!showSidebar ? 'w-full' : ''}`}>
          <Routes>
            {/* ─── PUBLIC ROUTES ──────────────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public crop browsing & traceability — no login required */}
            <Route path="/crops" element={<CropsList />} />
            <Route path="/crops/:id" element={<CropDetails />} />
            <Route path="/trace/:batchCode" element={<TraceabilityPage />} />

            {/* ─── AUTHENTICATED (any role) ────────────────────── */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityPlatform /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AgroLinkAiAssistant /></ProtectedRoute>} />
            <Route path="/gov-intelligence" element={<ProtectedRoute><GovernmentIntelligence /></ProtectedRoute>} />
            <Route path="/admin/intelligence" element={<ProtectedRoute><GovernmentIntelligence /></ProtectedRoute>} />
            <Route path="/price-prediction" element={<ProtectedRoute><PricePrediction /></ProtectedRoute>} />
            <Route path="/demand-forecasting" element={<ProtectedRoute><DemandForecasting /></ProtectedRoute>} />

            {/* ─── FARMER-ONLY ─────────────────────────────────── */}
            <Route
              path="/crops/add"
              element={
                <ProtectedRoute allowedRoles={['FARMER']}>
                  <AddCrop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'EXPERT', 'AGRICULTURAL_EXPERT']}>
                  <CropAdvisor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/disease-detection"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'EXPERT', 'AGRICULTURAL_EXPERT']}>
                  <CropDiseaseDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/waste-reduction"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'BUYER', 'BUSINESS_BUYER', 'SUPPLIER']}>
                  <WasteReductionModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/waste-reduction"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'SUPPLIER']}>
                  <WasteReductionModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment-rental"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'SUPPLIER']}>
                  <EquipmentRental />
                </ProtectedRoute>
              }
            />
            <Route
              path="/supplier-marketplace"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'SUPPLIER']}>
                  <SupplierMarketplace />
                </ProtectedRoute>
              }
            />

            {/* ─── BUYER/TRADE ──────────────────────────────────── */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={['BUYER', 'BUSINESS_BUYER']}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'BUYER', 'BUSINESS_BUYER']}>
                  <ContractFarming />
                </ProtectedRoute>
              }
            />
            <Route
              path="/negotiation"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'BUYER', 'BUSINESS_BUYER']}>
                  <TradeNegotiation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/experts"
              element={
                <ProtectedRoute allowedRoles={['FARMER', 'BUYER', 'BUSINESS_BUYER', 'EXPERT', 'AGRICULTURAL_EXPERT']}>
                  <ExpertModule />
                </ProtectedRoute>
              }
            />

            {/* ─── LOGISTICS-ONLY ───────────────────────────────── */}
            <Route
              path="/logistics"
              element={
                <ProtectedRoute allowedRoles={['LOGISTICS', 'LOGISTICS_PROVIDER']}>
                  <Logistics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
