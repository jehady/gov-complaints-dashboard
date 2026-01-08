import React, { useEffect, useState } from 'react'
import './Toaster.css'

export default function Toaster({ toasts = [], onDismiss }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(toasts)
  }, [toasts])

  useEffect(() => {
    const timers = items.map(t => setTimeout(() => onDismiss?.(t.id), t.duration || 3000))
    return () => timers.forEach(clearTimeout)
  }, [items, onDismiss])

  return (
    <div className="toaster">
      {items.map(t => (
        <div key={t.id} className={`toast ${t.type||'info'}`}>
          <strong>{t.title}</strong>
          <div>{t.message}</div>
        </div>
      ))}
    </div>
  )
}