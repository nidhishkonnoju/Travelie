import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import DealsExplorer from './pages/DealsExplorer';
import AdminPackages from './pages/AdminPackages';
import AdminDeals from './pages/AdminDeals';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Application Routes - With Layout */}
          <Route element={<Layout />}>
            {/* Explorer - Public */}
            <Route path="/" element={<Explorer />} />
            <Route path="/packages" element={<Explorer />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/deals" element={<DealsExplorer />} />

            {/* Protected User Routes */}
            <Route path="/book/:packageId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin-Only Routes */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/packages" element={<ProtectedRoute roles={['ADMIN']}><AdminPackages /></ProtectedRoute>} />
            <Route path="/admin/deals" element={<ProtectedRoute roles={['ADMIN']}><AdminDeals /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
