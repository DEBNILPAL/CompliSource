import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPageNew'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import DevelopersPage from './pages/DevelopersPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import PrototypeExplanation from './pages/PrototypeExplanation'
import HelpPage from './pages/HelpPage'
import UserGuidePage from './pages/UserGuidePage'

function App() {
  // Clear authentication only when website is first started (not on refresh)
  useEffect(() => {
    // Check if this is a fresh start (not a page refresh)
    const isRefresh = sessionStorage.getItem('app_initialized')
    
    if (!isRefresh) {
      // First time starting the website - clear any stored tokens
      localStorage.removeItem('cs_token')
      // Mark that app has been initialized for this browser session
      sessionStorage.setItem('app_initialized', 'true')
    }
    // If isRefresh exists, this is a page refresh, so keep the token
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/prototype" element={<PrototypeExplanation />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/guide" element={<UserGuidePage />} />
      </Routes>
    </Router>
  )
}

export default App
