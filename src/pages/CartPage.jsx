import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    clearCart,
  } = useCart()

  if (cart.length === 0) {
    return (
      <main className="max-w-page mx-auto px-5 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">
            Your Cart
          </h1>

          <p className="text-mist-500 mb-8">
            Your cart is currently empty.
          </p>

          <div className="flex justify-center gap-3">
            <Link
              to="/2d-artworks"
              className="bg-ink text-paper px-6 py-3 rounded-sm"
            >
              Browse 2D Artworks
            </Link>

            <Link
              to="/3d-assets"
              className="border border-ink px-6 py-3 rounded-sm"
            >
              Browse 3D Assets
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-page mx-auto px-5 py-10 md:py-16">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Your Cart
        </h1>

        <button
          type="button"
          onClick={clearCart}
          className="text-sm underline underline-offset-4"
        >
          Clear cart
        </button>
      </div>

      <div className="space-y-0 border-t border-mist-200">
        {cart.map((product) => (
          <div
            key={product.id}
            className="flex gap-4 py-5 border-b border-mist-200"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-sm"
            />

            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.15em] text-mist-500 mb-2">
                {product.category}
              </p>

              <h2 className="font-medium text-base md:text-lg">
                {product.title}
              </h2>

              <p className="mt-3">
                {product.price === 0
                  ? 'FREE'
                  : `$${product.price}`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeFromCart(product.id)}
              className="self-start text-sm underline underline-offset-4"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-md ml-auto mt-10">

        <div className="flex justify-between items-center text-lg">
          <span>Total</span>

          <span className="font-semibold">
            ${cartTotal.toFixed(2)}
          </span>
        </div>

        <Link
          to="/checkout"
          className="block w-full text-center bg-ink text-paper py-4 mt-6 rounded-sm font-medium hover:opacity-90 transition-opacity"
        >
          PROCEED TO CHECKOUT
        </Link>

      </div>
    </main>
  )
}