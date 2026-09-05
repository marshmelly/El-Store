import { useAuth } from '../context/AuthContext.jsx'

export default function Account() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-paper px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
          My Account
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-ink">
          Welcome, {user.displayName || 'Customer'}
        </h1>

        <p className="mt-4 text-sm text-ink/60">
          {user.email}
        </p>
      </div>
    </main>
  )
}