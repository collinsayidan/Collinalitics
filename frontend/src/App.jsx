
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import BlogList from './pages/BlogList';      // ⬅️ new
import BlogDetail from './pages/BlogDetail';  // ⬅️ new
import About from './pages/About';
import Contact from './pages/Contact';
// import Footer from './components/Footer';   // ⬅️ uncomment if you created it

function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-200">
        <strong>404:</strong> No route matched.
      </div>
    </div>
  );
}

/** Scroll to the top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        {/* App background */}
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-brand-500/30">
          <Navbar />

          <main className="max-w-6xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Services (keep nested if you have subroutes) */}
              <Route path="/services/*" element={<Services />} />

              {/* Portfolio */}
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />

              {/* Blog: list + detail */}
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />

              {/* Static pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
