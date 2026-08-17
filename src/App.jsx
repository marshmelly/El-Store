import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Artworks2D from './pages/Artworks2D.jsx'
import Assets3D from './pages/Assets3D.jsx'
import Tutorials from './pages/Tutorials.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

// NOTE: the PDF mockup only shows the black footer (logo + social icons)
// on the Home screen, but it's rendered site-wide here since that's the
// standard pattern. Remove <Footer /> from specific routes if the client
// actually wants it Home-only.
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/2d-artworks" element={<Artworks2D />} />
        <Route path="/3d-assets" element={<Assets3D />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
