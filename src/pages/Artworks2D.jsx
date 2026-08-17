import { useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import products2D from '../data/products2D.js'

const FILTERS = ['All', 'Rasters', 'Vectors', 'Freebies']

export default function Artworks2D() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return products2D.filter((p) => {
      const matchesFilter =
        active === 'All' ||
        (active === 'Freebies' ? p.price === 0 : p.category === active)
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
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

      <main className="max-w-page mx-auto p-0.5">
        {filtered.length === 0 ? (
          <p className="text-center py-20 px-5 text-mist-500">No artworks match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5 grid-flow-dense">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                image={p.image}
                title={p.title}
                price={p.price}
                tall={p.tall}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
