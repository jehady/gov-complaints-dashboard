import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('auth:user')
    if (saved) {
      setUser(JSON.parse(saved)),
      console.log(JSON.parse(saved));

    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/admin/login', {
        email,
        password,
      })


      // Adjust based on your backend response shape
      const u = response.data.data.user ; 
      console.log(u);
      localStorage.setItem("auth:token", response.data.data.token);
      const token = localStorage.getItem("auth:token");
      console.log(token);


      if (!u) throw new Error("خطأ غير متوقع: لا يوجد مستخدم في الاستجابة")

      setUser(u)
      localStorage.setItem('auth:user', JSON.stringify(u))
      

      return u

    } catch (err) {
      // Backend validation messages or network errors
      const msg = err.response || "خطأ في تسجيل الدخول"
      throw new Error(msg)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth:user')
    
  }


  const hasRole = (role) => user?.role === role
  const isAdmin = () => user?.role === 'admin'
 

  const value = useMemo(
    () => ({ user, loading, login, logout, hasRole, isAdmin }),
    [user, loading]
  ) 

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
