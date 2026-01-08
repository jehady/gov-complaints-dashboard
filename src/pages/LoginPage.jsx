import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@gov.local')
  const [password, setPassword] = useState('ChangeMe123!')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-page" dir="rtl">
      <form className="login-form" onSubmit={onSubmit} aria-label="Login form">
        <h2>تسجيل الدخول</h2>
        {error && <div className="error" role="alert">{error}</div>}

        <label htmlFor="email" className="input-label">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-invalid={!!error}
        />

        <div className="spacer" aria-hidden="true" />

        <label htmlFor="password" className="input-label">
          كلمة المرور
        </label>
        <input
          id="password"
          className="input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className="spacer" aria-hidden /> 

        <button className="btn primary" type="submit">دخول</button>
      </form>
    </div>
  )
}