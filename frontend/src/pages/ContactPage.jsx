import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import './StaticPage.css'

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: 'Property enquiry', message: '' })
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => { event.preventDefault(); setSubmitted(true) }

  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-inner">
          <span className="static-eyebrow">Contact Ocean Pyramid</span>
          <h1>Let's talk about your next property move.</h1>
          <p>Tell us what you're looking for, whether you're buying, renting, investing or enquiring about listing a property.</p>
        </div>
      </section>
      <section className="static-content">
        <div className="static-columns">
          <div>
            <h2>How can we help?</h2>
            <p>Use the enquiry form to prepare your message. The website's verified business telephone number and email address still need to be supplied before enquiries can be delivered to the Ocean Pyramid team.</p>
            <div className="static-panel">
              <h3>Contact information</h3>
              <ul className="static-list">
                <li><Phone size={18} /> Business telephone number to be confirmed</li>
                <li><Mail size={18} /> Business email address to be confirmed</li>
                <li><MapPin size={18} /> Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="static-panel">
            <h3>Send an enquiry</h3>
            {submitted ? <div className="static-notice">Your message has been captured in this page preview, but it has not been sent. A verified Ocean Pyramid email address or enquiry API is required to deliver it.</div> : (
              <form className="static-form" onSubmit={submit}>
                <label>Your name<input name="name" value={form.name} onChange={update} required /></label>
                <label>Email address<input type="email" name="email" value={form.email} onChange={update} required /></label>
                <label>Enquiry type<select name="subject" value={form.subject} onChange={update}><option>Property enquiry</option><option>Buying a property</option><option>Renting a property</option><option>Listing a property</option><option>Agent registration</option><option>Other</option></select></label>
                <label>Message<textarea name="message" value={form.message} onChange={update} required /></label>
                <button className="static-button" type="submit">Prepare enquiry</button>
                <div className="static-notice">Preview only: this form does not send or store messages yet. We'll connect it once the business contact details or backend enquiry endpoint are confirmed.</div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
export default ContactPage
