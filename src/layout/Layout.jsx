import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Toaster from '../components/Toaster'
import { useNotifications } from '../context/NotificationsContext'
import './Layout.css'

export default function Layout() {
  const { toasts, dismissToast } = useNotifications()
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Topbar />
        <main>
          <Outlet />
        </main>
        <Toaster toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  )
}