import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'

export default function ContactPage() {
  return (
    <>
      <Header />
      <BackBar />

      <main>
        <section className="section hero-min">
          <div className="container">
            <h1 className="page-title">Contact Our Professionals</h1>
            <p className="page-sub">Get in touch with our expert team for compliance guidance and support</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="professionals-grid">
              <div className="professional-card">
                <div className="professional-icon">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="CA Rajesh Kumar" />
                </div>
                <h3 className="professional-name">CA Rajesh Kumar</h3>
                <p className="professional-role">Chartered Accountant</p>
                <p className="professional-desc">Expert in taxation and financial compliance with 15+ years of experience</p>
                <div className="professional-contact">
                  <a href="mailto:rajesh.kumar@complisource.com" className="contact-link">
                    📧 rajesh.kumar@complisource.com
                  </a>
                  <a href="tel:+919876543210" className="contact-link">
                    📞 +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="professional-card">
                <div className="professional-icon">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Adv. Priya Sharma" />
                </div>
                <h3 className="professional-name">Adv. Priya Sharma</h3>
                <p className="professional-role">Corporate Lawyer</p>
                <p className="professional-desc">Specializes in corporate law and regulatory compliance frameworks</p>
                <div className="professional-contact">
                  <a href="mailto:priya.sharma@complisource.com" className="contact-link">
                    📧 priya.sharma@complisource.com
                  </a>
                  <a href="tel:+919876543211" className="contact-link">
                    📞 +91 98765 43211
                  </a>
                </div>
              </div>

              <div className="professional-card">
                <div className="professional-icon">
                  <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Dr. Anil Mehta" />
                </div>
                <h3 className="professional-name">Dr. Anil Mehta</h3>
                <p className="professional-role">Compliance Auditor</p>
                <p className="professional-desc">Certified auditor with expertise in risk assessment and compliance audits</p>
                <div className="professional-contact">
                  <a href="mailto:anil.mehta@complisource.com" className="contact-link">
                    📧 anil.mehta@complisource.com
                  </a>
                  <a href="tel:+919876543212" className="contact-link">
                    📞 +91 98765 43212
                  </a>
                </div>
              </div>

              <div className="professional-card">
                <div className="professional-icon">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Meera Patel" />
                </div>
                <h3 className="professional-name">Meera Patel</h3>
                <p className="professional-role">Data Protection Officer</p>
                <p className="professional-desc">GDPR and data privacy compliance specialist with global experience</p>
                <div className="professional-contact">
                  <a href="mailto:meera.patel@complisource.com" className="contact-link">
                    📧 meera.patel@complisource.com
                  </a>
                  <a href="tel:+919876543213" className="contact-link">
                    📞 +91 98765 43213
                  </a>
                </div>
              </div>

              <div className="professional-card">
                <div className="professional-icon">
                  <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="CA Suresh Iyer" />
                </div>
                <h3 className="professional-name">CA Suresh Iyer</h3>
                <p className="professional-role">Tax Consultant</p>
                <p className="professional-desc">GST and income tax compliance expert for SMEs and startups</p>
                <div className="professional-contact">
                  <a href="mailto:suresh.iyer@complisource.com" className="contact-link">
                    📧 suresh.iyer@complisource.com
                  </a>
                  <a href="tel:+919876543214" className="contact-link">
                    📞 +91 98765 43214
                  </a>
                </div>
              </div>

              <div className="professional-card">
                <div className="professional-icon">
                  <img src="https://randomuser.me/api/portraits/men/59.jpg" alt="Adv. Vikram Singh" />
                </div>
                <h3 className="professional-name">Adv. Vikram Singh</h3>
                <p className="professional-role">Legal Advisor</p>
                <p className="professional-desc">Contract law and intellectual property rights specialist</p>
                <div className="professional-contact">
                  <a href="mailto:vikram.singh@complisource.com" className="contact-link">
                    📧 vikram.singh@complisource.com
                  </a>
                  <a href="tel:+919876543215" className="contact-link">
                    📞 +91 98765 43215
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container narrow" style={{ textAlign: 'center' }}>
            <h2>General Inquiries</h2>
            <p>For general questions and support, reach out to our team:</p>
            <div style={{ marginTop: '2rem' }}>
              <a href="mailto:info@complisource.com" className="btn btn-accent btn-lg" style={{ margin: '0.5rem' }}>
                📧 Email Us
              </a>
              <a href="tel:+919876543200" className="btn btn-outline btn-lg" style={{ margin: '0.5rem' }}>
                📞 Call Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
