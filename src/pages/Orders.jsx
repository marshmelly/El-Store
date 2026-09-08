export default function Orders() {
  return (
    <main className="min-h-screen bg-paper px-6 py-20">
      <div className="mx-auto w-full max-w-6xl">

        <div className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
            My Account
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Orders
          </h1>

          <p className="mt-3 text-sm text-ink/60">
            View your purchases and order history.
          </p>
        </div>

        <div className="border border-ink/10 bg-white p-8">
          <p className="text-sm text-ink/50">
            Your orders will appear here once you make a purchase.
          </p>
        </div>

      </div>
    </main>
  )
}