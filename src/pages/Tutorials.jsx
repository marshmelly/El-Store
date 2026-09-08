import { useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar.jsx'
import TutorialCard from '../components/TutorialCard.jsx'
import tutorials from '../data/tutorials.js'

// NOTE: the PDF's filter bar shows "Cinema 4D Tutorials" twice — almost
// certainly meant to be "Maya Tutorials" for the second one, since two of
// the nine thumbnails are Maya videos. Using the corrected label here;
// double check with the client and adjust if they actually want the
// duplicate as shown.
const FILTERS = [
  'All',
  'Clip Studio Paint Tutorials',
  'Photoshop Tutorials',
  'Illustrator Tutorials',
  'Cinema 4D Tutorials',
  'Maya Tutorials',
]

export default function Tutorials() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return tutorials.filter((t) => {
      const matchesFilter = active === 'All' || t.category === active
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [active, search])

  return (
    <>
      <FilterBar
        filters={FILTERS}
        active={active}
        onFilterChange={setActive}
        search={search}
        onSearchChange={setSearch}
      />

      <main className="bg-ink min-h-[calc(100vh-var(--spacing-nav)-var(--spacing-subbar))] p-8">
        {filtered.length === 0 ? (
          <p className="text-center py-20 px-5 text-mist-500">No tutorials match your filters.</p>
        ) : (
          <div className="max-w-page mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
            {filtered.map((t) => (
              <TutorialCard key={t.id} image={t.image} title={t.title} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
