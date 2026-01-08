import React, { createContext, useContext, useEffect, useState } from 'react'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('mock:notifications') || '[]'))
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem('mock:notifications', JSON.stringify(items))
  }, [items])

  const push = (n) => {
    const withId = { id: `N-${Math.random().toString(36).slice(2,8)}`, ts: Date.now(), ...n }
    setItems(prev => [withId, ...prev])
  }

  const pushToast = (t) => {
    const withId = { id: `T-${Math.random().toString(36).slice(2,8)}`, type: 'info', ...t }
    setToasts(prev => [withId, ...prev])
  }

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const clearAll = () => setItems([])

  return (
    <NotificationsContext.Provider value={{ items, push, markRead, clearAll, toasts, pushToast, dismissToast }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}