import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${isActive ? 'text-white bg-brand-700' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`;

  return (
    <nav
      className={`sticky top-0 z-50 border-b app-border backdrop-blur
        bg-[var(--app-bg)]/80 transition
        ${scrolled ? 'shadow-sm shadow-black/40' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-white tracking-wide">
            <span className="grid place-items-center w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-indigo-500 text-white font-black">
              C
            </span>
            COLLINALITICS
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Desktop theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Mobile theme toggle */}
            <button
              className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-md border app-border text-slate-200 hover:bg-white/5"
              aria-label="Toggle color theme"
              onClick={() => {
                const html = document.documentElement;
                const current = html.getAttribute('data-theme') || 'dark';
                const next = current === 'light' ? 'dark' : 'light';
                html.setAttribute('data-theme', next);
                try { localStorage.setItem('theme', next); } catch {}
              }}
            >
              <i className="fa-regular fa-sun" aria-hidden="true" />
            </button>

            {/* Mobile hamburger */}
            <button
              className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-md border app-border text-slate-200 hover:bg-white/5"
              aria-label="Toggle menu"
              aria-expanded={open ? 'true' : 'false'}
              onClick={() => setOpen(v => !v)}
            >
              <svg className={`w-5 h-5 transition ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14M3 10h14M3 15h14" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop links */}
      <div className="hidden md:block">
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex items-center gap-1 py-2">
            <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/services" className={linkClass}>Services</NavLink></li>
            <li><NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink></li>
            <li><NavLink to="/blog" className={linkClass}>Blog</NavLink></li>
            <li><NavLink to="/about" className={linkClass}>About</NavLink></li>

            {/* Contact button using your new button system */}
            <li>
              <NavLink to="/contact" className="btn btn-primary btn-sm">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden border-t app-border bg-[var(--app-bg)] ${open ? 'block' : 'hidden'}`}>
        <ul className="px-4 py-2 space-y-1">
          <li><NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/services" className={linkClass} onClick={() => setOpen(false)}>Services</NavLink></li>
          <li><NavLink to="/portfolio" className={linkClass} onClick={() => setOpen(false)}>Portfolio</NavLink></li>
          <li><NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>Blog</NavLink></li>
          <li><NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink></li>

          {/* Mobile contact button */}
          <li>
            <NavLink
              to="/contact"
              className="btn btn-primary btn-md w-full"
              onClick={() => setOpen(false)}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
