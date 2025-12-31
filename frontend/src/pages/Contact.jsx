
// frontend/src/pages/Contact.jsx
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '../config/seo';

// Decide API base (prod uses VITE_API_BASE_URL, dev uses Vite proxy)
const isProd = import.meta.env.MODE === 'production';
const API_BASE = isProd ? import.meta.env.VITE_API_BASE_URL : '/api';

// If your backend uses /api/contact/ instead of /api/contacts/,
// change this to 'contact' and the CSRf/bootstrap path below will follow.
const CONTACT_PATH = 'contacts';

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

  // Ensure csrftoken cookie exists on first load (bootstrap)
  useEffect(() => {
    // Example: GET /api/contacts/csrf/ should set csrftoken cookie
    fetch(`${API_BASE}/${CONTACT_PATH}/csrf/`, { method: 'GET', credentials: 'include' })
      .catch(() => {});
  }, []);
  
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.email.trim()) return 'Please enter your email';
    if (!form.subject.trim()) return 'Please enter a subject';
    if (!form.message.trim()) return 'Please enter a message';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    const v = validate();
    if (v) { setErr(v); return; }

    setBusy(true);
    try {
      const csrftoken = getCookie('csrftoken');  // read CSRF cookie

      const res = await fetch(`${API_BASE}/${CONTACT_PATH}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,               // send CSRF header
        },
        credentials: 'include',                   // include cookies
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // DRF often returns JSON with {detail: "..."} or validation errors
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail || 'Failed to send. Please try again.');
      }

      const body = await res.json().catch(() => ({}));

      setOk(true);
      setForm({
        name: '', email: '', company: '', phone: '',
        subject: '', message: '', hp_field: ''
      });

      // Optional backend flag
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

      {/* Page layout */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Form card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h1 className="text-2xl font-black text-white">Let’s talk</h1>
          <p className="mt-2 text-slate-300">
            Start a project, request a quote, or ask a question. We’ll respond promptly.
          </p>

          {ok && (
            <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
              Thanks! Your message has been sent. We’ll get back to you soon.
            </div>
          )}

          {err && (
            <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              <strong className="font-semibold">Error:</strong> {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4 max-w-xl">
            {/* Honeypot: hidden input; bots often fill it, humans won't */}
            <input
              type="text"
              name="hp_field"
              value={form.hp_field}
              onChange={onChange}
              className="sr-only"
              autoComplete="off"
              aria-hidden="true"
              tabIndex={-1}
            />

            <div>
              <label className="block text-sm text-slate-300">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={onChange}
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300">Subject *</label>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={6}
                required
                minLength={10}
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              className="btn btn-primary px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={busy}
            >
              {busy ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>

        {/* Info card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white">What you can expect</h2>
          <ul className="mt-3 space-y-2 text-slate-300 list-disc pl-5">
            <li>Reply within 1–2 business days</li>
            <li>Short, focused discovery call</li>
            <li>Clear next steps and timelines</li>
          </ul>

          <div className="mt-6 text-sm text-slate-400">
            Prefer email? <span className="text-slate-200 font-semibold">contact@collinalitics.com</span>
          </div>
        </div>
      </section>
    </>
  );
}
