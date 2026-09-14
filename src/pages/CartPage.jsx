import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {

  // -------------------------------------------------------
  // CART DATA
  // -------------------------------------------------------
  //
  // Everything on this page comes from CartContext.
  //
  // cart            = products currently in the cart
  // cartCount       = total number of items
  // cartTotal       = current display total
  //
  // The functions allow the customer to modify the cart.
  // -------------------------------------------------------

  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart()


  // -------------------------------------------------------
  // EMPTY CART
  // -------------------------------------------------------
  //
  // If there are no products, don't show an empty table.
  // Give the customer useful navigation instead.
  // -------------------------------------------------------

  if (cart.length === 0) {

    return (
      <main className="max-w-page mx-auto px-5 py-20">

        <div className="text-center">

          <p className="text-xs uppercase tracking-[0.18em] text-mist-500 mb-3">
            Shopping Cart
          </p>

          <h1 className="text-3xl font-semibold mb-4">
            Your Cart
          </h1>

          <p className="text-mist-500 mb-8">
            Your cart is currently empty.
          </p>


          {/* ---------------------------------------------
              PRODUCT BROWSING LINKS
             --------------------------------------------- */}

          <div className="flex justify-center gap-3 flex-wrap">

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


  // -------------------------------------------------------
  // CART WITH PRODUCTS
  // -------------------------------------------------------

  return (

    <main className="max-w-page mx-auto px-5 py-10 md:py-16">

      {/* -----------------------------------------------
          PAGE HEADER
         ----------------------------------------------- */}

      <div className="flex items-center justify-between gap-4 mb-8">

        <div>

          <p className="text-xs uppercase tracking-[0.18em] text-mist-500 mb-2">
            Shopping Cart
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold">
            Your Cart
          </h1>

        </div>


        {/* Clear entire cart */}

        <button
          type="button"
          onClick={clearCart}
          className="text-sm underline underline-offset-4"
        >
          Clear cart
        </button>

      </div>


      {/* -----------------------------------------------
          CART + ORDER SUMMARY
         ----------------------------------------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">


        {/* =================================================
            CART ITEMS
           ================================================= */}

        <section className="border-t border-mist-200">

          {cart.map((product) => (

            <div
              key={product.productId}
              className="flex gap-4 py-5 border-b border-mist-200"
            >


              {/* -----------------------------------------
                  PRODUCT IMAGE
                 ----------------------------------------- */}

              <Link
                to={`/products/${product.productId}`}
                className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-mist-100 rounded-sm overflow-hidden"
              >

                {product.thumbnailUrl ? (

                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-xs text-mist-500">
                    No image
                  </div>

                )}

              </Link>


              {/* -----------------------------------------
                  PRODUCT INFORMATION
                 ----------------------------------------- */}

              <div className="flex-1 min-w-0">

                <p className="text-xs uppercase tracking-[0.15em] text-mist-500 mb-2">
                  {product.category ||
                    product.type ||
                    'Digital product'}
                </p>


                <Link
                  to={`/products/${product.productId}`}
                  className="font-medium text-base md:text-lg hover:underline underline-offset-4"
                >
                  {product.title}
                </Link>


                {/* Unit price */}

                <p className="mt-2">

                  {product.price === 0
                    ? 'FREE'
                    : `$${product.price.toFixed(2)}`}

                </p>


                {/* ---------------------------------------
                    QUANTITY CONTROLS
                   --------------------------------------- */}

                <div className="flex items-center gap-3 mt-4">

                  <span className="text-sm text-mist-500">
                    Quantity
                  </span>


                  <div className="flex items-center border border-mist-300 rounded-sm">

                    {/* DECREASE */}

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          product.productId
                        )
                      }
                      aria-label={`Decrease ${product.title} quantity`}
                      className="px-3 py-1.5 hover:bg-mist-100"
                    >
                      −
                    </button>


                    {/* CURRENT QUANTITY */}

                    <span
                      aria-live="polite"
                      className="min-w-8 text-center text-sm"
                    >
                      {product.quantity}
                    </span>


                    {/* INCREASE */}

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          product.productId
                        )
                      }
                      aria-label={`Increase ${product.title} quantity`}
                      className="px-3 py-1.5 hover:bg-mist-100"
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>


              {/* -----------------------------------------
                  ITEM TOTAL + REMOVE
                 ----------------------------------------- */}

              <div className="flex flex-col items-end justify-between gap-4">

                <p className="font-medium whitespace-nowrap">

                  $
                  {(
                    product.price *
                    product.quantity
                  ).toFixed(2)}

                </p>


                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(
                      product.productId
                    )
                  }
                  className="text-sm underline underline-offset-4"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </section>


        {/* =================================================
            ORDER SUMMARY
           ================================================= */}

        <aside className="lg:sticky lg:top-36 h-fit border border-mist-200 p-6 rounded-sm">

          <h2 className="text-lg font-semibold mb-6">
            Order summary
          </h2>


          {/* Number of items */}

          <div className="flex justify-between text-sm mb-3">

            <span className="text-mist-500">
              Items
            </span>

            <span>
              {cartCount}
            </span>

          </div>


          {/* Total */}

          <div className="flex justify-between text-lg pt-4 border-t border-mist-200">

            <span>
              Total
            </span>

            <span className="font-semibold">

              ${cartTotal.toFixed(2)}

            </span>

          </div>


          {/* ---------------------------------------------
              IMPORTANT SECURITY NOTE
             --------------------------------------------- */}

          <p className="text-xs text-mist-500 mt-4 leading-relaxed">

            This total is calculated on the client for display.
            Final pricing will be verified during checkout
            before payment.

          </p>


          {/* ---------------------------------------------
              CHECKOUT
             --------------------------------------------- */}

          <Link
            to="/checkout"
            className="block w-full text-center bg-ink text-paper py-4 mt-6 rounded-sm font-medium hover:opacity-90 transition-opacity"
          >
            PROCEED TO CHECKOUT
          </Link>

        </aside>

      </div>

    </main>
  )
}