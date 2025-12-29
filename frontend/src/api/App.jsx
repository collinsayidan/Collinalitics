
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';

function RouteDebug() {
  return (
    <div style={{background:'#102a43',color:'#cde9ff',padding:10,border:'1px solid #274868',margin:'12px 0'}}>
      <strong>DEBUG:</strong> Route <code>/portfolio/debug</code> rendered successfully.
    </div>
  );
}

function NotFound() {
  return (
    <div style={{background:'#44210f',color:'#ffdacc',padding:10,border:'1px solid #6a3a18',margin:'12px 0'}}>
      <strong>404:</strong> No route matched.
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/*" element={<Services />} />

          {/* Portfolio routes */}
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />

          {/* Debug helper route */}
          <Route path="/portfolio/debug" element={<RouteDebug />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
