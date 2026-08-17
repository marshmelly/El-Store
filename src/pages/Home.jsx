import { Link } from 'react-router-dom'
import heroCategories from '../data/heroCategories.js'

export default function Home() {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 auto-rows-[60vw] sm:auto-rows-[min(46vw,480px)]">
      {heroCategories.map((cat) => (
        <div key={cat.title} className="relative overflow-hidden">
          <img src={cat.image} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent"
            aria-hidden="true"
          />

          <h2 className="absolute top-7 left-7 text-paper font-extrabold tracking-tight text-[clamp(1.6rem,3vw,2.6rem)] px-5 py-2 bg-black/30 rounded-r-[40px] backdrop-blur-[2px]">
            {cat.title}
          </h2>

          {/*
            SHOP BUTTON — this currently just routes to the matching
            category page. If the client wants it to add straight to
            cart or open a quick-view modal instead, swap the <Link>
            for a click handler here.
          */}
          <Link to={cat.link} className="btn-pill absolute right-6 bottom-6">
            Shop
          </Link>
        </div>
      ))}
    </main>
  )
}
