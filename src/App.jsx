import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationsProvider } from './context/NotificationsContext'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import ComplaintsPage from './pages/ComplaintsPage'
import ComplaintDetailsPage from './pages/ComplaintDetailsPage'
import AdminPage from './pages/AdminPage'
import NotificationsPage from './pages/NotificationsPage'
import LoginPage from './pages/LoginPage'
import './layout/Layout.css'
import DepartmentPage from './pages/DepartmentPage'
import EmployeePage from './pages/EmployeePage'
import ReportsPage from './pages/ReportsPage'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return <div style={{ padding: 24 }}>جاري التحميل...</div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin()) return <Navigate to="/" replace />

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              
              {/* Admin only routes */}
              <Route path="Department" element={
                <ProtectedRoute adminOnly>
                  <DepartmentPage />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="employee" element={
                <ProtectedRoute adminOnly>
                  <EmployeePage />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute adminOnly>
                  <ReportsPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}