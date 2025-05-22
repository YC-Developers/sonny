import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SpareParts from './pages/SpareParts'
import StockIn from './pages/StockIn'
import StockOut from './pages/StockOut'
import Reports from './pages/Reports'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/spare-parts"
            element={
              <PrivateRoute>
                <SpareParts />
              </PrivateRoute>
            }
          />
          <Route
            path="/stock-in"
            element={
              <PrivateRoute>
                <StockIn />
              </PrivateRoute>
            }
          />
          <Route
            path="/stock-out"
            element={
              <PrivateRoute>
                <StockOut />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
)
