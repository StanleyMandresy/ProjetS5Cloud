import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { TravauxProvider } from "./context/TravauxContext";
import { SignalementProvider } from './context/SignalementContext';


import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TravauxProvider>
          <SignalementProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
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
        
        </SignalementProvider>
        </TravauxProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

