
// frontend/src/pages/Contact.jsx
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '../config/seo';

const API = '/api/contact/';

// Read the 'csrftoken' cookie set by Django
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    hp_field: '', // honeypot (bots fill, humans don't)
  });
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(null);

  const title = `Contact | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/contact`;

  // Ensure csrftoken cookie exists on first load
  useEffect(() => {
    fetch('/api/contact/csrf/', { method: 'GET', credentials: 'include' })
      .catch(() => {});
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.email.trim()) return 'Please enter your email';
    if (!form.subject.trim()) return 'Please enter a subject';
    if (!form.message.trim()) return 'Please enter a message';
    return null;
  };

  // Submit with CSRF + cookies
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    const v = validate();
    if (v) { setErr(v); return; }

    setBusy(true);
    try {
      const csrftoken = getCookie('csrftoken');  // read CSRF cookie

      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,               // send CSRF header
        },
        credentials: 'include',                   // include cookies
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail || 'Failed to send. Please try again.');
      }

      const body = await res.json().catch(() => ({}));

      setOk(true);
      setForm({
        name: '', email: '', company: '', phone: '',
        subject: '', message: '', hp_field: ''
      });

      // OPTIONAL: if backend reports email_error, show a soft notice
      if (body?.email_error) {
        setErr('Your message was received, but email notification failed. We will still see it in Admin.');
      }
    } catch (e) {
      setErr(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta
          name="description"
          content="Contact Collinalitics to start a data project, request a quote, or ask a question."
        />
      </Helmet>

      <section className="container">
        <h1 className="page-title">Contact</h1>
        <p>Start a project, request a quote, or ask a question. We’ll respond promptly.</p>

        {ok && (
          <div
            className="alert"
            style={{
              background: '#10331f',
              border: '1px solid #2b6b45',
              color: '#bfffe0',
              borderRadius: 10,
              padding: 12,
              margin: '12px 0',
            }}
          >
            Thanks! Your message has been sent. We’ll get back to you soon.
          </div>
        )}

        {err && (
          <div className="alert error" style={{ margin: '12px 0' }}>
            <strong>Error:</strong> {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="contact-form" style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          {/* Honeypot: hidden input; bots often fill it, humans won't */}
          <input
            type="text"
            name="hp_field"
            value={form.hp_field}
            onChange={onChange}
            style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
            autoComplete="off"
            aria-hidden="true"
            tabIndex={-1}
          />

          <div style={{ display: 'grid', gap: 8 }}>
            <label>Name *</label>
            <input name="name" value={form.name} onChange={onChange} className="input" />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label>Email *</label>
            <input name="email" value={form.email} onChange={onChange} className="input" type="email" />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label>Company</label>
            <input name="company" value={form.company} onChange={onChange} className="input" />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} className="input" />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label>Subject *</label>
            <input name="subject" value={form.subject} onChange={onChange} className="input" />
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <label>Message *</label>
            <textarea name="message" value={form.message} onChange={onChange} className="input" rows={6} />
          </div>

          <div className="cta-row" style={{ marginTop: 6 }}>
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
