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
import PricingPage from './pages/PricingPage'
import CareersPage from './pages/CareersPage'
import BlogListPage from './pages/BlogListPage'
import BlogArticlePage from './pages/BlogArticlePage'
import DocsPage from './pages/DocsPage'
import SupportPage from './pages/SupportPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CookiesPage from './pages/CookiesPage'

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
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
