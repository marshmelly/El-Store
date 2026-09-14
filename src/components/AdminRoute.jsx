import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'


/*
 * ADMIN ROUTE
 *
 * This protects the /admin area.
 *
 * We use the Firebase Authentication custom claim:
 *
 *     admin: true
 *
 * The actual security is enforced by Firestore rules as well.
 *
 * This component is only responsible for deciding whether
 * the user should be allowed to see the admin interface.
 */
export default function AdminRoute() {

  const {
    user,
    loading,
    isAdmin,
  } = useAuth()

  const location = useLocation()


  /*
   * Firebase is still restoring the user's login session.
   *
   * We wait before deciding whether the user is allowed
   * into the admin area.
   */
  if (loading) {

    return (
      <main className="min-h-screen bg-paper flex items-center justify-center">

        <p className="text-sm text-ink/60">
          Checking administrator access...
        </p>

      </main>
    )
  }


  /*
   * User is not logged in.
   *
   * Send them to the login page.
   *
   * We also remember where they were trying to go.
   */
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }


  /*
   * User is logged in but does not have:
   *
   *     admin: true
   *
   * in their Firebase Authentication custom claims.
   */
  if (!isAdmin) {

    return (
      <main className="min-h-screen bg-paper px-6 py-20">

        <div className="mx-auto max-w-md text-center">

          <h1 className="text-3xl font-semibold text-ink">
            Access denied
          </h1>

          <p className="mt-4 text-sm text-ink/60">
            You do not have permission to access
            the El-Store administrator area.
          </p>

        </div>

      </main>
    )
  }


  /*
   * User is authenticated and has the admin claim.
   *
   * Render the protected admin route.
   */
  return <Outlet />
}