import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Checkout() {
  const { cart, cartTotal } = useCart()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!form.email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!form.phone.trim()) {
      setError('Please enter your phone number.')
      return
    }

    console.log('Checkout submitted:', {
      customer: form,
      paymentMethod,
      products: cart,
      total: cartTotal,
    })

    alert(
      `Checkout ready.\n\nPayment method: ${
        paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'
      }\n\nPayment integration will be connected next.`
    )
  }

  if (cart.length === 0) {
    return (
      <main className="max-w-page mx-auto px-5 py-20">
        <div className="text-center">

          <h1 className="text-3xl font-semibold mb-4">
            Checkout
          </h1>

          <p className="text-mist-500 mb-8">
            Your cart is empty.
          </p>

          <Link
            to="/3d-assets"
            className="inline-block bg-ink text-paper px-6 py-3 rounded-sm"
          >
            Browse Assets
          </Link>

        </div>
      </main>
    )
  }

  return (
    <main className="max-w-page mx-auto px-5 py-10 md:py-16">

      {/* Back to cart */}

      <Link
        to="/cart"
        className="inline-block text-sm mb-8 underline underline-offset-4"
      >
        ← Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">

        {/* =========================
            CHECKOUT FORM
        ========================== */}

        <section>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-mist-500 mb-3">
              Secure Checkout
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold">
              Complete your purchase
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >

            {/* CONTACT INFORMATION */}

            <div>

              <h2 className="text-lg font-semibold mb-5">
                Contact information
              </h2>

              <div className="space-y-5">

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="w-full border border-mist-300 rounded-sm px-4 py-3 bg-transparent outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full border border-mist-300 rounded-sm px-4 py-3 bg-transparent outline-none focus:border-ink"
                  />

                  <p className="text-xs text-mist-500 mt-2">
                    Your download information will be sent to this address.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+254 700 000 000"
                    autoComplete="tel"
                    className="w-full border border-mist-300 rounded-sm px-4 py-3 bg-transparent outline-none focus:border-ink"
                  />
                </div>

              </div>

            </div>


            {/* PAYMENT METHOD */}

            <div>

              <h2 className="text-lg font-semibold mb-5">
                Payment method
              </h2>

              <div className="space-y-3">

                {/* M-PESA */}

                <label
                  className={
                    'flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-colors ' +
                    (paymentMethod === 'mpesa'
                      ? 'border-ink'
                      : 'border-mist-300')
                  }
                >

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      className="accent-current"
                    />

                    <div>
                      <p className="font-medium">
                        M-Pesa
                      </p>

                      <p className="text-xs text-mist-500 mt-1">
                        Pay using M-Pesa
                      </p>
                    </div>

                  </div>

                  <span className="text-xs text-mist-500">
                    M-PESA
                  </span>

                </label>


                {/* CARD */}

                <label
                  className={
                    'flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-colors ' +
                    (paymentMethod === 'card'
                      ? 'border-ink'
                      : 'border-mist-300')
                  }
                >

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      className="accent-current"
                    />

                    <div>
                      <p className="font-medium">
                        Card
                      </p>

                      <p className="text-xs text-mist-500 mt-1">
                        Credit or debit card
                      </p>
                    </div>

                  </div>

                  <span className="text-xs text-mist-500">
                    VISA / MC
                  </span>

                </label>

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 rounded-sm text-sm">
                {error}
              </div>
            )}


            {/* PURCHASE BUTTON */}

            <button
              type="submit"
              className="w-full bg-ink text-paper py-4 rounded-sm font-medium hover:opacity-90 transition-opacity"
            >
              COMPLETE PURCHASE — ${cartTotal.toFixed(2)}
            </button>

            <p className="text-xs text-mist-500 text-center leading-relaxed">
              You will be redirected to a secure payment provider
              when payment integration is enabled.
            </p>

          </form>

        </section>


        {/* =========================
            ORDER SUMMARY
        ========================== */}

        <aside className="lg:border-l lg:border-mist-200 lg:pl-10">

          <div className="lg:sticky lg:top-8">

            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">

              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4"
                >

                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">

                    <h3 className="text-sm font-medium leading-tight">
                      {product.title}
                    </h3>

                    <p className="text-xs text-mist-500 mt-1">
                      {product.category}
                    </p>

                    <p className="text-sm mt-2">
                      {product.price === 0
                        ? 'FREE'
                        : `$${product.price}`}
                    </p>

                  </div>

                </div>
              ))}

            </div>


            {/* TOTAL */}

            <div className="border-t border-mist-200 mt-8 pt-6">

              <div className="flex justify-between items-center">

                <span className="font-medium">
                  Total
                </span>

                <span className="text-xl font-semibold">
                  ${cartTotal.toFixed(2)}
                </span>

              </div>

            </div>


            {/* DIGITAL PRODUCT NOTICE */}

            <div className="border border-mist-200 rounded-sm p-4 mt-6">

              <p className="text-sm font-medium mb-1">
                Digital product
              </p>

              <p className="text-xs text-mist-500 leading-relaxed">
                No physical delivery is required. Your download
                will be made available after successful payment.
              </p>

            </div>

          </div>

        </aside>

      </div>

    </main>
  )
}