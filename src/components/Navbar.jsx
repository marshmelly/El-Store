import { NavLink } from 'react-router-dom'
import logo from '../assets/favicon1.png';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: '2D Artworks', to: '/2d-artworks' },
  { label: '3D Assets', to: '/3d-assets' },
  { label: 'Tutorials', to: '/tutorials' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-mist-100">
      <div className="max-w-page mx-auto h-nav px-8 flex items-center gap-6 flex-wrap md:h-[120px] md:flex-nowrap py-3 md:py-0">
      
        <NavLink to="/" aria-label="EL — Eliud Okwomi home" className="flex flex-col leading-none mr-3">
         
          <img src={logo} 
               alt="EL Logo" 
               className='w-35 h-35 object-contain'/>
        </NavLink>

        <nav className="flex items-center gap-1 flex-1 justify-center flex-wrap order-3 w-full md:order-none md:w-auto translate-y-11">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                'px-4 py-2 rounded-md text-sm font-medium transition-colors ' +
                (isActive ? 'bg-ink text-paper' : 'text-ink hover:bg-mist-100')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Spacer keeps the logo/links centered like the PDF; replace with
            a cart icon or account menu if the client wants one later. */}
        <div className="w-16 hidden md:block" aria-hidden="true" />
      </div>
    </header>
  )
}
