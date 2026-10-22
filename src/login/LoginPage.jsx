import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import logo from '../assets/unikl-official.png'
import Icon from '../landing/Icon.jsx'
import './LoginPage.css'

const ROLES = [
  { id: 'student', label: 'Student', idLabel: 'Student ID', placeholder: 'Enter your student ID' },
  { id: 'staff', label: 'Staff', idLabel: 'Staff ID', placeholder: 'Enter your staff ID' },
]

export default function LoginPage() {
  const [role, setRole] = useState('student')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeRole = ROLES.find((r) => r.id === role)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!id.trim() || !password) {
      setError(`Please enter your ${activeRole.idLabel.toLowerCase()} and password.`)
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
    }, 900)
  }

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <div className="login-dotgrid" />
        <div className="login-blob login-blob-orange" />
        <div className="login-blob login-blob-navy" />
      </div>

      <div className="login-shell">
        <Link to="/" className="login-brand">
          <img src={logo} alt="UniKL Royal College of Medicine Perak" />
        </Link>

        <div className="login-card">
          <div className="login-card-head">
            <h1>Welcome back</h1>
            <p>Sign in to access the UniKL RCMP student portal.</p>
          </div>

          <div className="role-switch" role="tablist" aria-label="Login as">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={role === r.id}
                className={`role-switch-btn ${role === r.id ? 'role-switch-btn-active' : ''}`}
                onClick={() => {
                  setRole(r.id)
                  setError('')
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span className="login-field-label">{activeRole.idLabel}</span>
              <input
                type="text"
                name="identifier"
                autoComplete="username"
                placeholder={activeRole.placeholder}
                value={id}
                onChange={(event) => setId(event.target.value)}
              />
            </label>

            <label className="login-field">
              <span className="login-field-label">Password</span>
              <div className="login-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye-off' : 'user'} />
                </button>
              </div>
            </label>

            {error && <p className="login-error">{error}</p>}

            <div className="login-row">
              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Remember me
              </label>
              <a href="#forgot-password" className="login-forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary btn-lg login-submit" disabled={submitting}>
              {submitting ? 'Signing in…' : `Sign in as ${activeRole.label}`}
            </button>
          </form>

          <p className="login-footnote">
            Having trouble signing in? Contact the SDCL department for assistance.
          </p>
        </div>

        <Link to="/" className="login-back">
          <Icon name="arrow-right" />
          Back to home
        </Link>
      </div>
    </div>
  )
}
