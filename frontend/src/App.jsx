import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({ children, requireFarmer, requireBuyer, requireLogistics }) => {
  const { isAuthenticated, isFarmer, isBuyer, isLogistics, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireFarmer && !(isFarmer || isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireBuyer && !(isBuyer || isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireLogistics && !(isLogistics || isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased">
      <Navbar />

      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}

        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/crops" element={<CropsList />} />
            <Route path="/crops/:id" element={<CropDetails />} />
            <Route path="/trace/:batchCode" element={<TraceabilityPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/advisor" element={<CropAdvisor />} />
            <Route path="/price-prediction" element={<PricePrediction />} />
            <Route path="/demand-forecasting" element={<DemandForecasting />} />
            <Route path="/disease-detection" element={<CropDiseaseDetection />} />
            <Route path="/negotiation" element={<TradeNegotiation />} />
            <Route path="/contracts" element={<ContractFarming />} />
            <Route path="/experts" element={<ExpertModule />} />
            <Route path="/supplier-marketplace" element={<SupplierMarketplace />} />
            <Route path="/equipment-rental" element={<EquipmentRental />} />
            <Route path="/community" element={<CommunityPlatform />} />

            <Route
              path="/crops/add"
              element={
                <ProtectedRoute requireFarmer>
                  <AddCrop />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute requireBuyer>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/logistics"
              element={
                <ProtectedRoute requireLogistics>
                  <Logistics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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
