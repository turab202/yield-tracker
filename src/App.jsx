import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HarvestYieldTracker from "./Pages/HarvestYieldTracker";
import Login from './Pages/Login';
import Register from './Pages/Register';
import ErrorBoundary from './Helper/ErrorBoundary';
import { useAuth } from './context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return user ? <Navigate to="/" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <HarvestYieldTracker />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
