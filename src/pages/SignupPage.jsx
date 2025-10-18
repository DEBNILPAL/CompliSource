import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setMessage('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }
    
    setMessage('Creating account...')
    
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || 'Registration failed')
      }
      
      const data = await res.json()
      setMessage('Account created! Logging you in...')
      
      // Automatically log in the user after signup
      setTimeout(async () => {
        try {
          const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          
          if (!loginRes.ok) throw new Error('Auto-login failed')
          
          const loginData = await loginRes.json()
          localStorage.setItem('cs_token', loginData.token)
          setMessage('Success! Redirecting to dashboard...')
          setTimeout(() => navigate('/dashboard'), 500)
        } catch (err) {
          setMessage('Account created! Please log in manually.')
          setTimeout(() => navigate('/login'), 1500)
        }
      }, 500)
    } catch (err) {
      setMessage(err.message || 'Registration failed')
    }
  }

  return (
    <>
      <Header activePage="signup" />
      <BackBar />

      <main>
        <section className="section hero-min" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
          <div className="container" style={{ maxWidth: '520px' }}>
            <h1 className="page-title">Create Account</h1>
            <p className="page-sub">Sign up to start using CompliSource.</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '1.5rem' }}>
          <div className="container" style={{ maxWidth: '520px' }}>
            <form id="signupForm" className="card" style={{ padding: '24px' }} onSubmit={handleSubmit}>
              <label>
                Username
                <input 
                  type="text" 
                  id="username"
                  required
                  placeholder="Choose a username" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #d7e0ea', borderRadius: '10px', marginTop: '6px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <div style={{ height: '12px' }}></div>
              <label>
                Email
                <input 
                  type="email" 
                  id="email"
                  required
                  placeholder="you@company.com" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #d7e0ea', borderRadius: '10px', marginTop: '6px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <div style={{ height: '12px' }}></div>
              <label>
                Password
                <input 
                  type="password" 
                  id="password"
                  required
                  placeholder="••••••••" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #d7e0ea', borderRadius: '10px', marginTop: '6px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                />
              </label>
              <div style={{ height: '12px' }}></div>
              <label>
                Confirm Password
                <input 
                  type="password" 
                  id="confirmPassword"
                  required
                  placeholder="••••••••" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #d7e0ea', borderRadius: '10px', marginTop: '6px' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="6"
                />
              </label>
              <div style={{ height: '18px' }}></div>
              <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }}>
                Sign Up
              </button>
              <p id="signupMsg" style={{ margin: '12px 0 0', color: '#51637a' }}>{message}</p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
