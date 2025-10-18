import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPageNew'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import DevelopersPage from './pages/DevelopersPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import PrototypeExplanation from './pages/PrototypeExplanation'
import HelpPage from './pages/HelpPage'
import UserGuidePage from './pages/UserGuidePage'
import { ToastProvider } from './components/ToastProvider'
import InfoPage from './pages/InfoPage'

function App() {
  return (
    <ToastProvider>
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/prototype" element={<PrototypeExplanation />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/guide" element={<UserGuidePage />} />
          <Route path="/info/:slug" element={<InfoPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
