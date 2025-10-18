import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function Header({ activePage = '' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if user is logged in (re-check on every route change)
    const token = localStorage.getItem('cs_token')
    if (token) {
      setIsLoggedIn(true)
      
      // Fetch profile info to show username/name in header
      fetch(`${API_BASE}/profile`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      })
        .then(res => {
          if (!res.ok) throw new Error('Auth expired')
          return res.json()
        })
        .then(data => {
          const email = data.email || ''
          setUserEmail(email)
          const uname = data.username || ''
          const name = data.name || ''
          const local = email.includes('@') ? email.split('@')[0] : email
          setDisplayName(uname || name || local || 'Profile')
        })
        .catch(() => {
          setIsLoggedIn(false)
          localStorage.removeItem('cs_token')
        })
      // Fetch user info
      fetch(`${API_BASE}/me`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      })
        .then(res => {
          if (!res.ok) throw new Error('Auth expired')
          return res.json()
        })
        .then(data => {
          // Proactively refresh token to extend session
          try {
            fetch(`${API_BASE}/auth/refresh`, { 
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            })
              .then(r => r.ok ? r.json() : null)
              .then(j => { if (j && j.token) localStorage.setItem('cs_token', j.token) })
              .catch(() => {})
          } catch {}
        })
        .catch(() => {
          setIsLoggedIn(false)
          localStorage.removeItem('cs_token')
        })
    } else {
      setIsLoggedIn(false)
      setUserEmail('')
    }
  }, [location.pathname]) // Re-check on route change

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleProfile = () => {
    setProfileOpen(!profileOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('cs_token')
    setIsLoggedIn(false)
    setUserEmail('')
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          <img src="/assets/img/logo.svg" alt="CompliSource" className="logo" />
          <span>CompliSource</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <button 
            className="nav-toggle" 
            aria-expanded={menuOpen} 
            aria-controls="nav-menu" 
            id="navToggle"
            onClick={toggleMenu}
          >
            Menu
          </button>
          <ul id="nav-menu" className={`nav-list ${menuOpen ? 'open' : ''}`}>
            {!isLoggedIn ? (
              <>
                <li className={activePage === 'features' ? 'active' : ''}>
                  <Link to="/features">Features</Link>
                </li>
                <li className={activePage === 'prototype' ? 'active' : ''}>
                  <Link to="/prototype">Prototype Explanation</Link>
                </li>
                <li className={activePage === 'about' ? 'active' : ''}>
                  <Link to="/about">About</Link>
                </li>
              </>
            ) : (
              <>
                <li className={activePage === 'dashboard' ? 'active' : ''}>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className={activePage === 'help' ? 'active' : ''}>
                  <Link to="/help">Help Desk</Link>
                </li>
                <li className={activePage === 'guide' ? 'active' : ''}>
                  <Link to="/guide">User Guide</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="header-ctas">
          {!isLoggedIn ? (
            (activePage === 'features' || activePage === 'prototype' || activePage === 'about') ? null : (
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#e0f7f4', 
                borderRadius: '8px',
                alignItems: 'center'
              }}>
                <Link className="btn btn-ghost" to="/signup">Sign Up</Link>
                <Link className="btn btn-accent" to="/login">Login</Link>
              </div>
            )
          ) : (
            <div className="profile-dropdown" style={{ position: 'relative' }}>
              <button 
                className="btn btn-accent" 
                onClick={toggleProfile}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>👤</span>
                <span>{displayName}</span>
              </button>
              {profileOpen && (
                <div 
                  className="dropdown-menu" 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    minWidth: '200px',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{displayName || 'Profile'}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>{userEmail}</div>
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <Link 
                      to="/profile" 
                      style={{ 
                        display: 'block', 
                        padding: '0.75rem 1rem', 
                        textDecoration: 'none', 
                        color: '#333',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile Details
                    </Link>
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.75rem 1rem', 
                        border: 'none',
                        background: 'transparent',
                        color: '#d32f2f',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                        fontSize: '1rem'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
