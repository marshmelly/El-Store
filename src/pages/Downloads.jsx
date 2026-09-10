import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../firebaseConfigFolder/firestore.js'
import { getUserPurchases } from '../services/purchaseService.js'

export default function Downloads() {
  const { user } = useAuth()

  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDownloads() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const purchases = await getUserPurchases(user.uid)

        const products = await Promise.all(
          purchases.map(async (purchase) => {
            if (!purchase.productId) {
              return null
            }

            const productSnapshot = await getDoc(
              doc(db, 'products', purchase.productId)
            )

            if (!productSnapshot.exists()) {
              return null
            }

            return {
              purchaseId: purchase.id,
              ...purchase,
              product: {
                id: productSnapshot.id,
                ...productSnapshot.data(),
              },
            }
          })
        )

        setDownloads(
          products.filter(Boolean)
        )
      } catch (error) {
        console.error('Failed to load downloads:', error)
        setError('Unable to load your downloads.')
      } finally {
        setLoading(false)
      }
    }

    loadDownloads()
  }, [user])

  if (loading) {
    return (
      <main className="max-w-page mx-auto px-5 py-20">
        <p className="text-sm tracking-wide text-mist-500">
          LOADING DOWNLOADS...
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
          Downloads
        </h1>
      </div>

      {downloads.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-mist-500">
            You don't have any purchased assets yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {downloads.map((item) => (
            <article
              key={item.purchaseId}
              className="border border-black/10 p-5"
            >
              {item.product.thumbnailUrl && (
                <img
                  src={item.product.thumbnailUrl}
                  alt={item.product.title}
                  className="mb-4 aspect-video w-full object-cover"
                />
              )}

              <p className="text-xs tracking-wide text-mist-500">
                {item.product.type}
              </p>

              <h2 className="mt-1 font-medium">
                {item.product.title}
              </h2>

              <p className="mt-2 text-sm text-mist-500">
                Version {item.product.version || '1.0'}
              </p>

              <button
                type="button"
                disabled
                className="mt-5 w-full border border-black/10 px-4 py-3 text-sm font-medium opacity-50"
              >
                DOWNLOAD — COMING SOON
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}