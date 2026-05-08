import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user, viewOnly, loading } = useAuth();

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

  if (viewOnly || user) {
    return children;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
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
    </AuthProvider>
  );
}

export default App;
