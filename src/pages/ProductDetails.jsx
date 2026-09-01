import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

import products2D from '../data/products2D.js'
import products3D from '../data/products3D.js'

export default function ProductDetails() {
  const { productId } = useParams()
  const { cart, addToCart } = useCart()
 

  const product = useMemo(() => {
    return [...products2D, ...products3D].find(
      (item) => item.id === productId
    )
  }, [productId])

  if (!product) {
    return (
      <main className="max-w-page mx-auto px-5 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Product not found
          </h1>

          <Link
            to="/"
            className="underline underline-offset-4"
          >
            Return home
          </Link>
        </div>
      </main>
    )
  }

  const isFree = product.price === 0
  const is3D = product.id.startsWith('3d-')

  return (
    <main className="max-w-page mx-auto px-5 py-10 md:py-16">
      <Link
  to={is3D ? '/3d-assets' : '/2d-artworks'}
  className="inline-block text-sm mb-8 underline underline-offset-4"
>
  ← Back to {is3D ? '3D Assets' : '2D Artworks'}
</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Product image */}
        <div className="bg-mist-100 rounded-sm overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full max-h-[700px] object-cover"
          />
        </div>

        {/* Product information */}
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.18em] text-mist-500 mb-3">
            {product.category}
          </p>

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-5">
            {product.title}
          </h1>

          <div className="text-xl mb-8">
            {isFree ? 'FREE' : `$${product.price}`}
          </div>

          <p className="text-mist-600 leading-relaxed mb-8">
            {isFree
              ? 'This digital asset is available for free download.'
              : 'A digital asset available for personal and creative projects.'}
          </p>

          <div className="border-t border-mist-200 pt-6 mb-8">
            <div className="flex justify-between py-2">
              <span className="text-mist-500">Category</span>
              <span>{product.category}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-mist-500">Type</span>
              <span>{is3D ? '3D Asset' : '2D Artwork'}</span>
            </div>
          </div>

          {isFree ? (
            <button
              type="button"
              className="w-full bg-ink text-paper py-4 rounded-sm font-medium hover:opacity-90 transition-opacity"
              onClick={() => {
                console.log('Free download:', product.id)
              }}
            >
              DOWNLOAD FREE
            </button>
          ) : (
           <button
                 type="button"
                 className="w-full bg-ink text-paper py-4 rounded-sm font-medium hover:opacity-90 transition-opacity"
                      onClick={() => {
                             addToCart(product)
                      }}
            >
                        {cart.some((item) => item.id === product.id)
                          ? 'ADDED TO CART'
                          : `ADD TO CART — $${product.price}`}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}