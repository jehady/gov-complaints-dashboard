import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

export default function Sidebar() {
  const { isAdmin } = useAuth()
  return (
    <aside className="sidebar">
      <div className="brand">منصة الشكاوى</div>
      <nav>
        <NavLink to="/" end>الرئيسية</NavLink>
        <NavLink to="/complaints">الشكاوى</NavLink>
        <NavLink to="/notifications">الإشعارات</NavLink>
      {isAdmin() &&   <NavLink to="/Department">الاقسام</NavLink> }
        {isAdmin() &&  <NavLink to="/employee">الموظفون</NavLink> }

      {isAdmin() &&  <NavLink to="/admin/reports" >التقارير</NavLink> }

        {isAdmin() && <NavLink to="/admin">الإدارة</NavLink>}
      </nav>
    </aside>
  )
}