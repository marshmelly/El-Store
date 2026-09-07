import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'

import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../firebaseConfigFolder/firestore.js'

export default function Account() {
  const { user } = useAuth()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  /*
   * Keep the local name field synchronized
   * with the Firebase user.
   */
  useEffect(() => {
    setName(user?.displayName || '')
  }, [user])

  const getProviderName = () => {
    const provider = user?.providerData?.[0]?.providerId

    if (provider === 'google.com') {
      return 'Google'
    }

    if (provider === 'password') {
      return 'Email & Password'
    }

    return 'Unknown'
  }

  const formatDate = (date) => {
    if (!date) return 'Not available'

    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleEdit = () => {
    setName(user?.displayName || '')
    setSuccessMessage('')
    setErrorMessage('')
    setEditing(true)
  }

  const handleCancel = () => {
    setName(user?.displayName || '')
    setSuccessMessage('')
    setErrorMessage('')
    setEditing(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()

    setSuccessMessage('')
    setErrorMessage('')

    const trimmedName = name.trim()

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (trimmedName.length < 2) {
      setErrorMessage('Your name must be at least 2 characters.')
      return
    }

    setSaving(true)

  try {
  // Update Firebase Authentication
  await updateProfile(user, {
    displayName: trimmedName,
  })

  // Update the user's Firestore profile
  await updateDoc(
    doc(db, 'users', user.uid),
    {
      name: trimmedName,
    }
  )

  setName(trimmedName)
  setEditing(false)

  setSuccessMessage(
    'Your profile has been updated successfully.'
  )
} catch (error) {
      console.error('Profile update failed:', error)

      setErrorMessage(
        'Unable to update your profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-20">
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
            My Account
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Welcome, {user?.displayName || 'Customer'}
          </h1>

          <p className="mt-3 text-sm text-ink/60">
            Manage your account, orders and digital downloads.
          </p>
        </div>

        {/* Account Layout */}
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">

          {/* Sidebar */}
          <aside className="border-b border-ink/10 pb-6 md:border-b-0 md:border-r md:pr-6">

  <nav className="space-y-2">

    <NavLink
      to="/account"
      className={({ isActive }) =>
        `block w-full rounded-sm px-4 py-3 text-left text-sm font-medium transition ${
          isActive
            ? 'bg-ink text-paper'
            : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
        }`
      }
    >
      Profile
    </NavLink>

    <NavLink
      to="/orders"
      className={({ isActive }) =>
        `block w-full rounded-sm px-4 py-3 text-left text-sm font-medium transition ${
          isActive
            ? 'bg-ink text-paper'
            : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
        }`
      }
    >
      Orders
    </NavLink>

    <NavLink
      to="/downloads"
      className={({ isActive }) =>
        `block w-full rounded-sm px-4 py-3 text-left text-sm font-medium transition ${
          isActive
            ? 'bg-ink text-paper'
            : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
        }`
      }
    >
      Downloads
    </NavLink>

  </nav>

</aside>

          {/* Main Content */}
          <section>

            {/* Section Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
                  Profile
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                  Account information
                </h2>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-fit border border-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-ink transition hover:bg-ink hover:text-paper"
                >
                  Edit Profile
                </button>
              )}

            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Profile Card */}
            <div className="border border-ink/10 bg-white p-6 md:p-8">

              {/* Profile Header */}
              <div className="mb-10 flex items-center gap-5">

                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink text-2xl font-bold text-paper">

                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Profile'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}

                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ink">
                    {user?.displayName || 'Customer'}
                  </h3>

                  <p className="mt-1 text-sm text-ink/50">
                    {user?.email}
                  </p>
                </div>

              </div>

              {/* EDIT MODE */}
              {editing ? (

                <form onSubmit={handleSave}>

                  {/* Name Input */}
                  <div className="max-w-xl">

                    <label
                      htmlFor="profile-name"
                      className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40"
                    >
                      Full name
                    </label>

                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      disabled={saving}
                      autoFocus
                      className="mt-3 w-full border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-ink disabled:cursor-not-allowed disabled:opacity-50"
                    />

                  </div>

                  {/* Email */}
                  <div className="mt-8 max-w-xl">

                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                      Email address
                    </p>

                    <p className="mt-3 text-sm font-medium text-ink">
                      {user?.email || 'Not available'}
                    </p>

                    <p className="mt-2 text-xs text-ink/40">
                      Email changes are handled separately for account security.
                    </p>

                  </div>

                  {/* Actions */}
                  <div className="mt-10 flex flex-wrap gap-3">

                    <button
                      type="submit"
                      disabled={saving}
                      className="border border-ink bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-paper transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              ) : (

                /* VIEW MODE */
                <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">

                  {/* Full Name */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                      Full name
                    </p>

                    <p className="mt-2 text-sm font-medium text-ink">
                      {user?.displayName || 'Not provided'}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                      Email address
                    </p>

                    <p className="mt-2 text-sm font-medium text-ink">
                      {user?.email || 'Not available'}
                    </p>
                  </div>

                  {/* Email Verification */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                      Email status
                    </p>

                    <p className="mt-2 text-sm font-medium text-ink">
                      {user?.emailVerified
                        ? 'Verified'
                        : 'Not verified'}
                    </p>
                  </div>

                  {/* Sign-in Method */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                      Sign-in method
                    </p>

                    <p className="mt-2 text-sm font-medium text-ink">
                      {getProviderName()}
                    </p>
                  </div>

                  {/* Account Created */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                      Account created
                    </p>

                    <p className="mt-2 text-sm font-medium text-ink">
                      {formatDate(user?.metadata?.creationTime)}
                    </p>
                  </div>

                  {/* Last Sign In */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                      Last sign in
                    </p>

                    <p className="mt-2 text-sm font-medium text-ink">
                      {formatDate(user?.metadata?.lastSignInTime)}
                    </p>
                  </div>

                </div>

              )}

            </div>

          </section>

        </div>

      </div>
    </main>
  )
}