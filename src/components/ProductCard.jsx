/**
 * Grid tile used on the 2D Artworks and 3D Assets pages.
 * Shows the artwork, a title/price overlay, and a "FREE" badge
 * when price is 0.
 *
 * Clicking the card opens the product detail page.
 */
import { useNavigate } from 'react-router-dom'

export default function ProductCard({
  id,
  image,
  title,
  price,
  tall = false,
}) {
  const isFree = price === 0
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className={
        'group relative block w-full h-full min-h-[220px] p-0 bg-mist-100 overflow-hidden rounded-sm text-left ' +
        (tall ? 'row-span-2 min-h-[460px]' : '')
      }
      onClick={() => {
        navigate(`/products/${id}`)
      }}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
      />

      {isFree && (
        <span className="absolute top-3 right-3 bg-ink text-paper w-11 h-11 rounded-full flex items-center justify-center text-[0.6rem] font-bold tracking-wide">
          FREE
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 px-3.5 pt-6 pb-2.5 bg-gradient-to-t from-black/75 to-transparent flex items-end justify-between gap-2">
        <span className="text-paper text-sm font-medium leading-tight">
          {title}
        </span>

        <span className="text-mist-300 text-xs whitespace-nowrap">
          {isFree ? '$0' : `$${price}`}
        </span>
      </div>
    </button>
  )
}