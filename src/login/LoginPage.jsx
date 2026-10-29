import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import logo from '../assets/unikl-official.png'
import { MotionConfig, motion } from 'motion/react'
import '@fontsource/bowlby-one'
import '@fontsource/nothing-you-could-do'
import Icon from '../landing/Icon.jsx'
import Sticker from '../landing/Sticker.jsx'
import '../landing/LandingPage.css'
import '../landing/Home.css'
import './LoginPage.css'

const LOGIN_STICKERS = [
  { name: 'laptop', label: 'learning aid', x: '18%', y: '20%', size: 130, rotate: -8 },
  { name: 'nasi-lemak', label: 'makan time', x: '80%', y: '24%', size: 120, rotate: 8 },
  { name: 'car', label: 'parking sorted', x: '22%', y: '82%', size: 140, rotate: 4 },
  { name: 'medicine', label: 'clinic visit', x: '78%', y: '80%', size: 96, rotate: -10 },
]

const ROLES = [
  { id: 'student', label: 'Student', idLabel: 'Student ID', placeholder: 'Enter your student ID' },
  { id: 'staff', label: 'Staff', idLabel: 'Staff ID', placeholder: 'Enter your staff ID' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeRole = ROLES.find((r) => r.id === role)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!id.trim() || !password) {
      setError(`Please enter your ${activeRole.idLabel.toLowerCase()} and password.`)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role, identifier: id.trim(), password }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Unable to sign in. Please try again.')
        return
      }

      if (data.user?.role === 'SYSTEM_ADMIN') {
        navigate({ to: '/admin' })
      } else if (data.user?.role === 'STUDENT') {
        navigate({ to: '/student' })
      } else {
        navigate({ to: '/dashboard' })
      }
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="login-page">
        <div className="mg-panel login-panel">
          <div className="login-stickers">
            {LOGIN_STICKERS.map((sticker, index) => (
              <Sticker key={sticker.name} {...sticker} delay={0.3 + index * 0.1} />
            ))}
          </div>

          <div className="login-top">
            <Link to="/" className="pill pill-white login-back">
              <Icon name="arrow-right" />
              Home
            </Link>
            <Link to="/" className="brand login-brand">
              <img src={logo} alt="UniKL Royal College of Medicine Perak" className="brand-logo" />
            </Link>
          </div>

          <div className="login-shell">
            <motion.div
              className="login-intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            >
              <p className="mg-script login-hello">welcome back!</p>
              <h1 className="mg-display login-title">Let&rsquo;s get you sorted.</h1>
            </motion.div>

            <motion.div
              className="login-card"
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.1 }}
            >
              <div className="login-card-head">
                <h2 className="mg-display">Sign in</h2>
                <p>Access the UniKL RCMP student portal.</p>
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
                    <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                    Remember me
                  </label>
                  <a href="#forgot-password" className="login-forgot">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="pill pill-orange pill-lg login-submit" disabled={submitting}>
                  {submitting ? 'Signing in…' : `Sign in as ${activeRole.label}`}
                  {!submitting && <Icon name="arrow-right" />}
                </button>
              </form>

              <p className="login-footnote">Having trouble signing in? Contact the SDCL department for assistance.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
