
import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
    <nav className={`sticky top-0 z-50 border-b border-white/5 ${scrolled ? 'shadow-sm shadow-black/40' : ''} bg-slate-950/80 backdrop-blur`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-white tracking-wide">
            <span className="grid place-items-center w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-indigo-500 text-white font-black">
              C
            </span>
            COLLINALITICS
          </Link>

          {/* Mobile hamburger */}
          <button
            className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-md border border-white/10 text-slate-200 hover:bg-white/5"
            aria-label="Toggle menu"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen(v => !v)}
          >
            <svg className={`w-5 h-5 transition ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5h14M3 10h14M3 15h14" clipRule="evenodd" />
            </svg>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/services" className={linkClass}>Services</NavLink></li>
            <li><NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink></li>
            <li><NavLink to="/blog" className={linkClass}>Blog</NavLink></li>
            <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
            <li>
              <NavLink to="/contact" className={({ isActive }) =>
                `btn px-3 py-2 text-sm font-semibold rounded-md ${isActive ? 'bg-brand-700 text-white' : 'btn-primary'}`
              }>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden border-t border-white/5 bg-slate-950 ${open ? 'block' : 'hidden'}`}>
        <ul className="px-4 py-2 space-y-1">
          <li><NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/services" className={linkClass} onClick={() => setOpen(false)}>Services</NavLink></li>
          <li><NavLink to="/portfolio" className={linkClass} onClick={() => setOpen(false)}>Portfolio</NavLink></li>
          <li><NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>Blog</NavLink></li>
          <li><NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink></li>
          <li>
            <NavLink to="/contact" className="btn btn-primary px-3 py-2 text-sm font-semibold rounded-md" onClick={() => setOpen(false)}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
