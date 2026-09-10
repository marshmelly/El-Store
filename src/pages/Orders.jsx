import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getUserOrders } from '../services/orderService.js'

export default function Orders() {
  const { user } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const userOrders = await getUserOrders(user.uid)

        setOrders(userOrders)
      } catch (error) {
        console.error('Failed to load orders:', error)
        setError('Unable to load your orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user])

  if (loading) {
    return (
      <main className="max-w-page mx-auto px-5 py-20">
        <p className="text-sm tracking-wide text-mist-500">
          LOADING ORDERS...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-page mx-auto px-5 py-20">
        <p className="text-sm text-red-500">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-page mx-auto px-5 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-mist-500">
          ACCOUNT
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-mist-500">
            You don't have any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="border border-black/10 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs tracking-wide text-mist-500">
                    ORDER
                  </p>

                  <p className="font-medium">
                    {order.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs tracking-wide text-mist-500">
                    STATUS
                  </p>

                  <p className="font-medium capitalize">
                    {order.status || 'Unknown'}
                  </p>
                </div>

                <div>
                  <p className="text-xs tracking-wide text-mist-500">
                    TOTAL
                  </p>

                  <p className="font-medium">
                    {order.currency || 'USD'}{' '}
                    {Number(order.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className="mt-5 border-t border-black/10 pt-4">
                  <p className="mb-3 text-xs font-semibold tracking-wide text-mist-500">
                    ITEMS
                  </p>

                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={`${item.productId || 'item'}-${index}`}
                        className="flex justify-between gap-4 text-sm"
                      >
                        <span>
                          {item.title || item.productId}
                        </span>

                        <span>
                          {order.currency || 'USD'}{' '}
                          {Number(item.price || 0).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}