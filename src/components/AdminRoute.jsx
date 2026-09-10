import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'

import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../firebaseConfigFolder/firestore.js'


export default function AdminRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      // No user means there is nobody to check.
      if (!user) {
        setIsAdmin(false)
        setCheckingAdmin(false)
        return
      }

      try {
        // We look for:
        //
        // admins/{currently logged-in user's UID}
        //
        // This means we are NOT trusting an email address
        // supplied by the browser.
        const adminRef = doc(db, 'admins', user.uid)

        const adminSnapshot = await getDoc(adminRef)

        setIsAdmin(adminSnapshot.exists())
      } catch (error) {
        console.error('Failed to verify admin access:', error)
        setIsAdmin(false)
      } finally {
        setCheckingAdmin(false)
      }
    }

    checkAdmin()
  }, [user])

  // Firebase is still restoring the login session.
  if (loading || checkingAdmin) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-sm text-ink/60">
          Checking administrator access...
        </p>
      </main>
    )
  }

  // Not logged in.
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // Logged in, but not an administrator.
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-paper px-6 py-20">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-semibold text-ink">
            Access denied
          </h1>

          <p className="mt-4 text-sm text-ink/60">
            You do not have permission to access the El-Store
            administrator area.
          </p>
        </div>
      </main>
    )
  }

  // User is authenticated AND exists in the admins collection.
  return <Outlet />
}