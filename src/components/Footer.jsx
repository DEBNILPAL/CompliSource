import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useToast } from './ToastProvider'
import AnimatedFooterLogo from './AnimatedFooterLogo'

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear())
  const navigate = useNavigate()
  const toast = useToast()

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDashboardNav = (e) => {
    const token = localStorage.getItem('cs_token')
    if (!token) {
      e.preventDefault()
      toast.show('Please login to access the dashboard.', 'info', 2000)
      navigate('/login')
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-gradient"></div>
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section footer-brand-section">
            <div className="footer-brand-animated">
              <AnimatedFooterLogo />
            </div>
            <p className="footer-tagline">
              Secure, transparent compliance authentication powered by blockchain technology.
            </p>
            <div className="socials">
              <a href="https://github.com/" aria-label="GitHub" target="_blank" rel="noopener" className="social">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.09-.74.09-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.92 1.23 3.23 0 4.62-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.23v3.3c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noopener" className="social">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5ZM.5 8h4V24h-4V8Zm7 0h3.8v2.2h.05c.53-1 1.84-2.2 3.79-2.2 4.05 0 4.8 2.67 4.8 6.14V24h-4v-6.98c0-1.66-.03-3.79-2.31-3.79-2.31 0-2.67 1.8-2.67 3.67V24h-4V8Z"/>
                </svg>
              </a>
              <a href="https://twitter.com/" aria-label="Twitter" target="_blank" rel="noopener" className="social">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Product</h3>
            <ul className="footer-links">
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/developers">For Developers</Link></li>
              <li><Link to="/dashboard" onClick={handleDashboardNav}>Dashboard</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/info/careers">Careers</Link></li>
              <li><Link to="/info/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><Link to="/info/docs">Documentation</Link></li>
              <li><Link to="/info/api">API Reference</Link></li>
              <li><Link to="/info/support">Support</Link></li>
              <li><Link to="/info/status">System Status</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="copyright">© {year} CompliSource. All rights reserved.</span>
            <div className="footer-legal">
              <Link to="/info/privacy">Privacy Policy</Link>
              <span className="separator">•</span>
              <Link to="/info/terms">Terms of Service</Link>
              <span className="separator">•</span>
              <Link to="/info/cookies">Cookie Policy</Link>
            </div>
          </div>
          <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  )
}
