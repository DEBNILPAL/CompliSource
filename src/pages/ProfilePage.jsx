import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('cs_token')
    if (!token) {
      setError('Please login to view your profile.')
      setTimeout(() => navigate('/login'), 700)
      return
    }
    fetch(`${API_BASE}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then((data) => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Session expired. Please login again.')
        localStorage.removeItem('cs_token')
        setTimeout(() => navigate('/login'), 800)
      })
  }, [navigate])

  const formatDate = (ts) => {
    if (!ts) return '—'
    try { return new Date(ts * 1000).toLocaleString() } catch { return String(ts) }
  }

  return (
    <>
      <Header activePage="profile" />
      <BackBar />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '720px' }}>
            <h1 className="page-title">Profile Details</h1>
            <p className="page-sub">View your account information</p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: '720px' }}>
            {loading && (
              <div className="card" style={{ padding: '16px' }}>Loading profile…</div>
            )}
            {error && (
              <div className="card" style={{ padding: '16px', color: '#b91c1c' }}>{error}</div>
            )}
            {(!loading && !error && profile) && (
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '10px' }}>
                  <div style={{ fontWeight: 600 }}>Full Name</div>
                  <div>{profile.name || '—'}</div>
                  <div style={{ fontWeight: 600 }}>Username</div>
                  <div>{profile.username || '—'}</div>
                  <div style={{ fontWeight: 600 }}>Email</div>
                  <div>{profile.email}</div>
                  <div style={{ fontWeight: 600 }}>Phone</div>
                  <div>{profile.phone || '—'}</div>
                  <div style={{ fontWeight: 600 }}>Address</div>
                  <div>{profile.address || '—'}</div>
                  <div style={{ fontWeight: 600 }}>Business Name</div>
                  <div>{profile.business_name || '—'}</div>
                  <div style={{ fontWeight: 600 }}>GSTIN</div>
                  <div>{profile.gstin || '—'}</div>
                  <div style={{ fontWeight: 600 }}>Member Since</div>
                  <div>{formatDate(profile.created_at)}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
