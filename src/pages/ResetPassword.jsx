import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth'

import { auth } from '../firebaseConfigFolder/auth'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()

  const [resetCode, setResetCode] = useState('')
  const [loading, setLoading] = useState(true)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    const code = searchParams.get('oobCode')

    if (!code) {
      setError('This password reset link is invalid or incomplete.')
      setLoading(false)
      return
    }

    const verifyCode = async () => {
      try {
        await verifyPasswordResetCode(auth, code)

        setResetCode(code)
      } catch (error) {
        console.error('Password reset code verification failed:', error)

        switch (error.code) {
          case 'auth/expired-action-code':
            setError(
              'This password reset link has expired. Please request a new one.'
            )
            break

          case 'auth/invalid-action-code':
            setError(
              'This password reset link is invalid or has already been used.'
            )
            break

          case 'auth/user-disabled':
            setError(
              'This account has been disabled. Please contact support.'
            )
            break

          default:
            setError(
              'Unable to verify this password reset link.'
            )
        }
      } finally {
        setLoading(false)
      }
    }

    verifyCode()
  }, [searchParams])

  const handleResetPassword = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setResetLoading(true)

    try {
      await confirmPasswordReset(
        auth,
        resetCode,
        password
      )

      setSuccess(
        'Your password has been changed successfully.'
      )

      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Password reset failed:', error)

      switch (error.code) {
        case 'auth/expired-action-code':
          setError(
            'This password reset link has expired. Please request a new one.'
          )
          break

        case 'auth/invalid-action-code':
          setError(
            'This password reset link is invalid or has already been used.'
          )
          break

        case 'auth/weak-password':
          setError(
            'Please choose a stronger password.'
          )
          break

        default:
          setError(
            'Unable to reset your password. Please try again.'
          )
      }
    } finally {
      setResetLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-paper px-6 py-20">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center">
          <p className="text-xs font-bold tracking-[0.25em] text-ink/50">
            VERIFYING RESET LINK...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-20">
      <div className="mx-auto w-full max-w-md">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
            Account Security
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Reset Password
          </h1>

          <p className="mt-3 text-sm text-ink/60">
            Create a new password for your El-Store account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success ? (
          <div className="space-y-6">

            <div className="rounded-sm border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
              {success}
            </div>

            <Link
              to="/login"
              className="block w-full rounded-sm bg-ink px-5 py-3.5 text-center text-sm font-bold tracking-wide text-paper transition hover:opacity-90"
            >
              GO TO LOGIN
            </Link>

          </div>
        ) : resetCode && !error ? (

          <form
            onSubmit={handleResetPassword}
            className="space-y-5"
          >

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-ink"
              >
                New password
              </label>

              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your new password"
                autoComplete="new-password"
                required
                className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Confirm new password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your new password"
                autoComplete="new-password"
                required
                className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full rounded-sm bg-ink px-5 py-3.5 text-sm font-bold tracking-wide text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetLoading
                ? 'CHANGING PASSWORD...'
                : 'CHANGE PASSWORD'}
            </button>

          </form>

        ) : (
          <Link
            to="/login"
            className="block w-full rounded-sm bg-ink px-5 py-3.5 text-center text-sm font-bold tracking-wide text-paper transition hover:opacity-90"
          >
            BACK TO LOGIN
          </Link>
        )}

      </div>
    </main>
  )
}