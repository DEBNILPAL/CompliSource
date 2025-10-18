import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackBar from '../components/BackBar'
import { useToast } from '../components/ToastProvider'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('Signing in...')
    
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!res.ok) {
        let detail = ''
        try { const j = await res.json(); detail = j?.detail || '' } catch {}
        if (res.status === 404 || /not registered/i.test(detail)) {
          setMessage('Account not registered. Redirecting to sign up...')
          toast.show('Account not registered. Please sign up first.', 'error', 2500)
          setTimeout(() => navigate('/signup'), 600)
          return
        }
        toast.show(detail || 'Invalid credentials', 'error', 2500)
        throw new Error(detail || 'Invalid credentials')
      }
      
      const data = await res.json()
      localStorage.setItem('cs_token', data.token)
      setMessage('Success. Redirecting...')
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (err) {
      const msg = (err && err.message) ? err.message : ''
      if (msg === 'Failed to fetch') {
        toast.show(`Cannot reach API at ${API_BASE}. Please ensure the backend is running.`, 'error', 3500)
        setMessage('Connection error')
      } else {
        setMessage(msg || 'Login failed')
      }
    }
  }

  return (
    <>
      <BackBar />
      <main>
        <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ maxWidth: '480px' }}>
            <form id="loginForm" className="card" style={{ padding: '24px' }} onSubmit={handleSubmit}>
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
                />
              </label>
              <div style={{ height: '18px' }}></div>
              <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }}>
                Sign In
              </button>
              <p id="loginMsg" style={{ margin: '12px 0 0', color: '#51637a' }}>{message}</p>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
