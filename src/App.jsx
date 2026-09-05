import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import Artworks2D from './pages/Artworks2D.jsx'
import Assets3D from './pages/Assets3D.jsx'
import Tutorials from './pages/Tutorials.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

import ProductDetails from './pages/ProductDetails.jsx'
import CartPage from './pages/CartPage.jsx'
import Checkout from './pages/Checkout.jsx'

import Login from './pages/LogIn.jsx'
import Signup from './pages/SignUp.jsx'
import Account from './pages/Account.jsx'

import ResetPassword from './pages/ResetPassword.jsx'

import { useAuth } from './context/AuthContext.jsx'

function App() {

  const { user, loading, isLoggedIn } = useAuth()

      console.log('Auth loading:', loading)
      console.log('Logged in:', isLoggedIn)
      console.log('Current user:', user) 
  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />

        <Route path="/2d-artworks" element={<Artworks2D />} />

        <Route path="/3d-assets" element={<Assets3D />} />

        <Route path="/products/:productId" element={<ProductDetails />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/tutorials" element={<Tutorials />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/reset-password" element={<ResetPassword />}
/>

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
        </Route>  

      </Routes>

      <Footer />
    </>
  )
}

export default App