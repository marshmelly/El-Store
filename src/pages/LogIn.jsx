import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from 'firebase/auth'

import { auth } from '../firebaseConfigFolder/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const destination = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  const [ showReset, setShowReset ] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      navigate(destination, { replace: true })
    } catch (error) {
      console.error('Login failed:', error)

      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Incorrect email or password.')
          break

        case 'auth/invalid-email':
          setError('Please enter a valid email address.')
          break

        case 'auth/too-many-requests':
          setError(
            'Too many failed attempts. Please try again later.'
          )
          break

        default:
          setError('Unable to log in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)

    try {
      const provider = new GoogleAuthProvider()

      await signInWithPopup(auth, provider)

      navigate('/')
    } catch (error) {
      console.error('Google login failed:', error)

      if (error.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled.')
      } else {
        setError('Unable to sign in with Google. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const handlePasswordReset = async (event) => {
    event.preventDefault()

    setError('')
    setResetMessage('')

  if (!resetEmail.trim()) {
    setError('Please enter your email address.')
    return
  }

  setResetLoading(true)

  try {
    await sendPasswordResetEmail(auth, resetEmail.trim())

    setResetMessage(
      'Password reset email sent. Check your inbox.'
    )

    setResetEmail('')
  } catch (error) {
    console.error('Password reset failed:', error)

    switch (error.code) {
      case 'auth/invalid-email':
        setError('Please enter a valid email address.')
        break

      case 'auth/user-not-found':
        setError('No account was found with that email.')
        break

      case 'auth/too-many-requests':
        setError(
          'Too many attempts. Please wait a while and try again.'
        )
        break

      default:
        setError(
          'Unable to send the password reset email. Please try again.'
        )
    }
  } finally {
    setResetLoading(false)
  }
}

  return (
    <main className="min-h-screen bg-paper px-6 py-20">
      <div className="mx-auto w-full max-w-md">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-ink/50 uppercase">
            Welcome Back
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Log in to El-Store
          </h1>

          <p className="mt-3 text-sm text-ink/60">
            Access your account, purchases and downloads.
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-sm border border-ink/15 bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.35 12.27c0-.78-.07-1.54-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
              fill="#4285F4"
            />
            <path
              d="M12 21.8c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.8Z"
              fill="#34A853"
            />
            <path
              d="M6.54 13.88a5.86 5.86 0 0 1 0-3.76V7.59H3.3a9.8 9.8 0 0 0 0 8.82l3.24-2.53 3.24-2.53Z"
              fill="#FBBC05"
            />
            <path
              d="M12 6.09c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.18 14.63 2.2 12 2.2a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.81 9.46 6.09 12 6.09Z"
              fill="#EA4335"
            />
          </svg>

          {googleLoading
            ? 'CONNECTING...'
            : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-ink/10" />

          <span className="text-xs font-medium tracking-wider text-ink/35">
            OR
          </span>

          <div className="h-px flex-1 bg-ink/10" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink"
              >
                Password
              </label>

              <button
                   type="button"
                    onClick={() => {
                         setResetEmail(email)
                         setResetMessage('')
                         setError('')
                         setShowReset((current) => !current)
                    }}
                          className="text-xs text-ink/50 transition hover:text-ink"
              >
                   {showReset ? 'Close' : 'Forgot password?'}
              </button>
            </div>

            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-sm bg-ink px-5 py-3.5 text-sm font-bold tracking-wide text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>

        </form>

      {showReset && (
  <div className="mt-10 border-t border-mist-100 pt-8">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
      Reset password
    </p>

    <p className="mt-2 text-sm text-ink/60">
      Enter your email and we'll send you a link to create a new password.
    </p>

    <form
      onSubmit={handlePasswordReset}
      className="mt-5 space-y-4"
    >
      <input
        type="email"
        value={resetEmail}
        onChange={(event) => setResetEmail(event.target.value)}
        placeholder="Email address"
        autoComplete="email"
        required
        className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
      />

      <button
        type="submit"
        disabled={resetLoading}
        className="w-full rounded-sm bg-ink px-4 py-3 text-sm font-bold tracking-wide text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {resetLoading ? 'SENDING...' : 'SEND RESET LINK'}
      </button>
    </form>

    {resetMessage && (
      <p className="mt-4 text-sm font-medium text-green-600">
        {resetMessage}
      </p>
    )}
  </div>
)}

        {/* Signup */}
        <div className="mt-8 text-center text-sm text-ink/60">
          Don't have an account?{' '}

          <Link
            to="/signup"
            className="font-semibold text-ink underline underline-offset-4"
          >
            Create one
          </Link>
        </div>

      </div>
    </main>
  )
}