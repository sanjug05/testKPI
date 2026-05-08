import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { PERMISSIONS, hasPermission } from '../config/rbac';
import ErrorBoundary from '../components/shared/error/ErrorBoundary';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';

const ProtectedRoute = ({ children, permission = PERMISSIONS.DASHBOARD_READ }) => {
  const { user, viewOnly, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="glass-effect px-6 py-4">
          <div className="animate-spin h-6 w-6 border-2 border-teal border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-teal text-sm text-center">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if ((viewOnly || user) && hasPermission(profile.role, permission)) {
    return children;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ className: '!bg-navy !text-white !border !border-teal/30' }} />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
