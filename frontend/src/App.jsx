import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PackageProvider } from './context/PackageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Explorer from './pages/Explorer';
import PackageDetails from './pages/PackageDetails';
import Booking from './pages/Booking';
import Messages from './pages/Messages';
import MyBookings from './pages/MyBookings';
import GlobeExplorer from './pages/GlobeExplorer';
import AdminPackages from './pages/AdminPackages';
import AdminDeals from './pages/AdminDeals';
import UserManagement from './pages/UserManagement';
import Landing from './pages/Landing';

function App() {
  return (
    <AuthProvider>
      <PackageProvider>
        <Router>
          <Routes>
            {/* Landing — standalone with its own header/footer */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth — standalone */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All other pages — wrapped in shared Layout (TopNavBar + Footer, NO sidebar) */}
            <Route element={<Layout />}>
              {/* Public pages (visible to everyone, no login required) */}
              <Route path="/packages" element={<Explorer />} />
              <Route path="/exclusive-deals" element={<GlobeExplorer />} />
              <Route path="/deals" element={<Navigate to="/exclusive-deals" replace />} />

              {/* Protected: requires login */}
              <Route path="/packages/:id" element={<ProtectedRoute><PackageDetails /></ProtectedRoute>} />
              <Route path="/book/:packageId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Admin-only */}
              <Route path="/dashboard" element={<ProtectedRoute roles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/packages" element={<ProtectedRoute roles={['ADMIN']}><AdminPackages /></ProtectedRoute>} />
              <Route path="/admin/deals" element={<ProtectedRoute roles={['ADMIN']}><AdminDeals /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PackageProvider>
    </AuthProvider>
  );
}

export default App;
