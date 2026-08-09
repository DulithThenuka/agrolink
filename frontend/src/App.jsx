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

const ProtectedRoute = ({ children, requireFarmer }) => {
  const { isAuthenticated, isFarmer } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireFarmer && !isFarmer) {
    return <Navigate to="/crops" replace />;
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
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/advisor" element={<CropAdvisor />} />
            <Route path="/price-prediction" element={<PricePrediction />} />
            <Route path="/demand-forecasting" element={<DemandForecasting />} />
            <Route path="/disease-detection" element={<CropDiseaseDetection />} />
            <Route path="/negotiation" element={<TradeNegotiation />} />
            <Route path="/contracts" element={<ContractFarming />} />








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
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/logistics"
              element={
                <ProtectedRoute>
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
