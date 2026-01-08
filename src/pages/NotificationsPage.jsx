import React from 'react'
import { useNotifications } from '../context/NotificationsContext'
import dayjs from 'dayjs'

export default function NotificationsPage() {
  const { items, markRead, clearAll } = useNotifications()

  return (
    <div className="page">
      <h2>الإشعارات</h2>
      <div className="actions">
        <button className="btn danger" onClick={clearAll}>مسح الكل</button>
      </div>
      <ul>
        {items.map(n => (
          <li key={n.id}>
            <b>{n.title}</b> - {n.body} - {dayjs(n.ts).format('YYYY/MM/DD HH:mm')}
            {!n.read && <button className="btn" onClick={() => markRead(n.id)}>تحديد كمقروء</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}