import React, { useEffect, useRef } from 'react';
// Fix: Updated react-router-dom imports to be compatible with v6/v7.
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { ToastProvider, useToast } from './contexts/ToastContext';

import Login from './pages/Login';
import RegisterCart from './pages/RegisterCart';
import ScanProduct from './pages/ScanProduct';
import CartSummary from './pages/CartSummary';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import ExitGate from './components/ExitGate';
import Header from './components/Header';
import Toast from './components/Toast';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'user' ? children : <Navigate to="/" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    const showHeader = isAuthenticated && location.pathname !== '/';

    return (
        <div className="flex flex-col h-screen font-sans">
            {showHeader && <Header />}
            <main className="flex-grow overflow-y-auto p-4 md:p-6">
                <Routes>
                    <Route path="/" element={<Login />} />
                    
                    {/* User Routes */}
                    <Route path="/register-cart" element={<PrivateRoute><RegisterCart /></PrivateRoute>} />
                    <Route path="/scan" element={<PrivateRoute><ScanProduct /></PrivateRoute>} />
                    <Route path="/cart" element={<PrivateRoute><CartSummary /></PrivateRoute>} />
                    <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                    <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
                    <Route path="/exit" element={<PrivateRoute><ExitGate /></PrivateRoute>} />
                    <Route path="/history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                </Routes>
            </main>
        </div>
    );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <AuthProvider>
            <HashRouter>
              <AppContent />
            </HashRouter>
          </AuthProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const AppContent: React.FC = () => {
  const { message, type, isVisible, showToast } = useToast();
  const { totalAmount, budget } = useCart();
  const prevTotalAmountRef = useRef(totalAmount);

  useEffect(() => {
    if (!budget || totalAmount <= prevTotalAmountRef.current) {
        prevTotalAmountRef.current = totalAmount;
        return;
    }

    const budgetWarningThreshold = budget * 0.9;

    if (prevTotalAmountRef.current < budget && totalAmount > budget) {
        showToast(`Budget of ₹${budget} exceeded!`, 'error');
    } else if (prevTotalAmountRef.current < budgetWarningThreshold && totalAmount >= budgetWarningThreshold && prevTotalAmountRef.current < budget) {
        showToast(`Nearing your budget of ₹${budget}.`, 'info');
    }

    prevTotalAmountRef.current = totalAmount;
  }, [totalAmount, budget, showToast]);

  return (
    <>
      <AppRoutes />
      <Toast message={message} type={type} isVisible={isVisible} />
    </>
  );
};