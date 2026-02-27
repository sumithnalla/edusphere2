
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AllotBatches from './pages/AllotBatches';
import AdminDailyClasses from './pages/AdminDailyClasses';
import AdminRecordedClasses from './pages/AdminRecordedClasses';
import AdminDoubtsClasses from './pages/AdminDoubtsClasses';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Resources from './pages/Resources';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        
        {/* Student Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/allot-batches" element={<AllotBatches />} />
        <Route path="/admin/daily-classes" element={<AdminDailyClasses />} />
        <Route path="/admin/recorded-classes" element={<AdminRecordedClasses />} />
        <Route path="/admin/doubts-classes" element={<AdminDoubtsClasses />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
