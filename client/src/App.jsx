import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DemoAuth from './pages/DemoAuth'
import Register from './pages/Register'
import Welcome from './pages/Welcome'

export function App() {
  return (
    <Routes>
      <Route path="/demo" element={<DemoAuth />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register" element={<Register />} />

      {/* Default routes */}
      <Route 
        path="/" 
        element={<Navigate to="/demo" replace />}
      />
      <Route 
        path="*" 
        element={<Navigate to="/demo" replace />}
      />
    </Routes>
  );
}