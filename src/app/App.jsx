import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/rbac';
import ErrorBoundary from '../components/shared/error/ErrorBoundary';
import LoadingState from '../components/shared/ui/LoadingState';
import LoginPage from '../pages/LoginPage';
import EnterpriseRouteGuard from '../platform/routing/EnterpriseRouteGuard';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ className: '!bg-navy !text-white !border !border-teal/30' }} />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard/*"
              element={
                <EnterpriseRouteGuard permission={PERMISSIONS.DASHBOARD_READ}>
                  <Suspense fallback={<section className="min-h-screen bg-navy p-6"><LoadingState message="Loading AIS Operations Platform…" /></section>}>
                    <DashboardPage />
                  </Suspense>
                </EnterpriseRouteGuard>
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
