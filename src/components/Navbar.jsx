import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import logo from '../assets/favicon1.png'


// ---------------------------------------------------------
// MAIN WEBSITE NAVIGATION
// ---------------------------------------------------------
// Cart is intentionally NOT placed in this array.
//
// We render Cart separately below because it has a
// dynamic cart count.
// ---------------------------------------------------------

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: '2D Artworks', to: '/2d-artworks' },
  { label: '3D Assets', to: '/3d-assets' },
  { label: 'Tutorials', to: '/tutorials' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]


export default function Navbar() {

  // -------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------

  const {
    user,
    loading,
    isLoggedIn,
    logout,
  } = useAuth()


  // -------------------------------------------------------
  // CART
  // -------------------------------------------------------
  //
  // cartCount comes directly from CartContext.
  //
  // Example:
  //
  // Empty cart  → 0
  // One product → 1
  // Two products → 2
  // Same product × 2 → 2
  //
  // Because this comes from CartContext, the Navbar
  // automatically updates whenever the cart changes.
  // -------------------------------------------------------

  const { cartCount } = useCart()


  const navigate = useNavigate()


  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------

  const handleLogout = async () => {

    try {

      await logout()

      navigate('/')

    } catch (error) {

      console.error(
        'Logout failed:',
        error
      )

    }
  }


  // -------------------------------------------------------
  // NAVBAR
  // -------------------------------------------------------

  return (

    <header className="sticky top-0 z-50 bg-paper border-b border-mist-100">

      <div
        className="
          max-w-page
          mx-auto
          h-nav
          px-8
          flex
          items-center
          gap-6
          flex-wrap
          md:h-[120px]
          md:flex-nowrap
          py-3
          md:py-0
        "
      >


        {/* =================================================
            LOGO
           ================================================= */}

        <NavLink
          to="/"
          aria-label="EL — Eliud Okwomi home"
          className="flex flex-col leading-none mr-3"
        >

          <img
            src={logo}
            alt="EL Logo"
            className="w-35 h-35 object-contain"
          />

        </NavLink>


        {/* =================================================
            MAIN NAVIGATION
           ================================================= */}

        <nav
          className="
            flex
            items-center
            gap-1
            flex-1
            justify-center
            flex-wrap
            order-3
            w-full
            md:order-none
            md:w-auto
            translate-y-11
          "
        >

          {NAV_LINKS.map((link) => (

            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                'px-4 py-2 rounded-md text-sm font-medium transition-colors ' +
                (
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-ink hover:bg-mist-100'
                )
              }
            >
              {link.label}
            </NavLink>

          ))}


          {/* =================================================
              CART
             =================================================
             
              This is separate from NAV_LINKS because the
              number beside Cart changes dynamically.
             
              Empty:
                Cart
             
              One item:
                Cart (1)
             
              Three items:
                Cart (3)
             ================================================= */}
{/* =================================================
    CART — LOGGED-IN USERS ONLY
   =================================================

   The Cart link is only rendered when the user
   is authenticated.

   Logged out:
       Cart is completely hidden.

   Logged in:
       Cart appears with the live item count.
   ================================================= */}

{isLoggedIn && (
  <NavLink
    to="/cart"
    className={({ isActive }) =>
      'px-4 py-2 rounded-md text-sm font-medium transition-colors ' +
      (
        isActive
          ? 'bg-ink text-paper'
          : 'text-ink hover:bg-mist-100'
      )
    }
  >
    Cart{cartCount > 0 ? ` (${cartCount})` : ''}
  </NavLink>
)}
        </nav>


        {/* =================================================
            ACCOUNT / AUTHENTICATION
           ================================================= */}

        <div className="hidden md:flex items-center justify-end min-w-[150px]">

          {loading ? (

            // ---------------------------------------------
            // AUTHENTICATION IS STILL LOADING
            // ---------------------------------------------

            <span className="text-sm text-ink/40">
              ...
            </span>

          ) : isLoggedIn ? (

            // ---------------------------------------------
            // LOGGED-IN USER
            // ---------------------------------------------

            <div className="flex items-center gap-4">

              <Link
                to="/account"
                className="text-sm font-medium text-ink transition hover:opacity-60"
              >
                {user?.displayName || 'Account'}
              </Link>


              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-ink transition hover:opacity-60"
              >
                Log out
              </button>

            </div>

          ) : (

            // ---------------------------------------------
            // LOGGED-OUT USER
            // ---------------------------------------------

            <div className="flex items-center gap-4">

              <Link
                to="/login"
                className="text-sm font-medium text-ink transition hover:opacity-60"
              >
                Log in
              </Link>


              <Link
                to="/signup"
                className="text-sm font-medium text-ink transition hover:opacity-60"
              >
                Sign up
              </Link>

            </div>

          )}

        </div>

      </div>

    </header>
  )
}
