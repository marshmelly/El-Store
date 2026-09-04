import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebaseConfigFolder/auth.js'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebaseConfigFolder/firestore.js'


export default function Signup() {
  
  const navigate = useNavigate()

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')

const [loading, setLoading] = useState(false)
const [googleLoading, setGoogleLoading] = useState(false)
const [error, setError] = useState('')

const handleSignup = async (event) => {
  event.preventDefault()

  setError('')

  if (password !== confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  if (password.length < 6) {
    setError('Password must be at least 6 characters.')
    return
  }

  setLoading(true)

  try {
    const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  const user = userCredential.user

    await updateProfile(user, {
       displayName: name,
    })

       await setDoc(doc(db, 'users', user.uid), {
       name: name,
       email: user.email,
       photoURL: user.photoURL || null,
       createdAt: serverTimestamp(),
   })

   navigate('/')
  } catch (error) {
    console.error('Signup failed:', error)

    switch (error.code) {
      case 'auth/email-already-in-use':
        setError('An account already exists with this email.')
        break

      case 'auth/invalid-email':
        setError('Please enter a valid email address.')
        break

      case 'auth/weak-password':
        setError('Please choose a stronger password.')
        break

      default:
        setError('Unable to create your account. Please try again.')
    }
  } finally {
    setLoading(false)
  }
}

const handleGoogleSignup = async () => {
  setError('')
  setGoogleLoading(true)

  try {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(
      auth,
      provider
    )

    const user = result.user

    await setDoc(
      doc(db, 'users', user.uid),
      {
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    )

    navigate('/')
  } catch (error) {
    console.error('Google signup failed:', error)

    if (error.code === 'auth/popup-closed-by-user') {
      setError('Google sign-in was cancelled.')
    } else {
      setError(
        'Unable to sign in with Google. Please try again.'
      )
    }
  } finally {
    setGoogleLoading(false)
  }
}

  return (
    <main className="min-h-screen bg-paper px-6 py-20">
      <div className="mx-auto w-full max-w-md">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-ink/50 uppercase">
            Create Account
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Join El-Store
          </h1>

          <p className="mt-3 text-sm text-ink/60">
            Create an account to manage your purchases and downloads.
          </p>
        </div>

        {/* Google signup */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex w-full items-center justify-center gap-3 rounded-sm border border-ink/15 bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-ink/5"
        >
          {/* Google icon */}
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
              d="M6.54 13.88a5.86 5.86 0 0 1 0-3.76V7.59H3.3a9.8 9.8 0 0 0 0 8.82l3.24-2.53Z"
              fill="#FBBC05"
            />
            <path
              d="M12 6.09c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.18 14.63 2.2 12 2.2a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.81 9.46 6.09 12 6.09Z"
              fill="#EA4335"
            />
          </svg>

          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-ink/10" />

          <span className="text-xs font-medium tracking-wider text-ink/35">
            OR
          </span>

          <div className="h-px flex-1 bg-ink/10" />
        </div>

        {/* Signup form */}
        {error && (
            <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                 {error}
            </div>
       )}

        <form 
            onSubmit={handleSignup}
            className="space-y-5">

          {/* Full name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autocomplete="name"
              required
              className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
            />
          </div>

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
              onChange={(e) => setEmail(e.target.value)}
              autocomplete="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autocomplete="new-password"
              required
              minLength={6}
              className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
            />

            <p className="mt-2 text-xs text-ink/45">
              Password must be at least 6 characters.
            </p>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autocomplete="new-password"
              required
              minLength={6}
              className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 text-xs leading-relaxed text-ink/55">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 accent-black"
            />

            <span>
              I agree to the El-Store terms and conditions.
            </span>
          </label>

          {/* Submit */}
          <button
               type="submit"
                disabled={loading || googleLoading}
                    className="w-full rounded-sm bg-ink px-5 py-3.5 text-sm font-bold tracking-wide text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
           </button>

        </form>

        {/* Login */}
        <div className="mt-8 text-center text-sm text-ink/60">
          Already have an account?{' '}

          <Link
            to="/login"
            className="font-semibold text-ink underline underline-offset-4"
          >
            Log in
          </Link>
        </div>

      </div>
    </main>
  )
}