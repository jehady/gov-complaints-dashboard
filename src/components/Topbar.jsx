import React from 'react'
import { useAuth } from '../context/AuthContext'
import './Topbar.css'

export default function Topbar() {
  const { user, logout } = useAuth()
  return (
    <header className="topbar">
      <div className="left">
        <span className="title">لوحة التحكم</span>
      </div>
      <div className="right">
        {user ? (
          <>
            <span className="user">{user.name} ({user.role === 'admin' ? 'مشرف' : 'موظف'})</span>
            <button className="logout" onClick={logout}>تسجيل الخروج</button>
          </>
        ) : null}
      </div>
    </header>
  )
}