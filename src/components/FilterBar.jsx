/**
 * Black strip under the nav with checkbox-style category filters
 * and a search box, matching the 2D Artworks / 3D Assets / Tutorials
 * screens in the PDF.
 *
 * props:
 *  - filters: string[]        e.g. ['All', 'Rasters', 'Vectors', 'Freebies']
 *  - active: string           currently selected filter
 *  - onFilterChange: (f) => void
 *  - search: string
 *  - onSearchChange: (v) => void
 */
export default function FilterBar({ filters, active, onFilterChange, search, onSearchChange }) {
  return (
    <div className="bg-ink min-h-subbar flex items-center">
      <div className="max-w-page mx-auto w-full px-8 py-2 flex items-center justify-between gap-6 flex-wrap">
        <ul className="flex items-center gap-5 flex-wrap">
          {filters.map((f) => (
            <li key={f}>
              <label className="flex items-center gap-2 text-paper text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={active === f}
                  onChange={() => onFilterChange(f)}
                  className="peer sr-only"
                />
                <span
                  className="w-[15px] h-[15px] border-[1.5px] border-paper rounded-[3px] shrink-0 relative
                             peer-checked:bg-paper
                             peer-checked:after:content-[''] peer-checked:after:absolute
                             peer-checked:after:left-[4px] peer-checked:after:top-[1px]
                             peer-checked:after:w-1 peer-checked:after:h-2
                             peer-checked:after:border-ink peer-checked:after:border-r-2 peer-checked:after:border-b-2
                             peer-checked:after:rotate-45"
                  aria-hidden="true"
                />
                {f}
              </label>
            </li>
          ))}
        </ul>

        {/* Search is client-side only right now (filters the mock data array).
            Wire this up to a real API / search index when the backend exists. */}
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search products"
          className="bg-transparent border border-mist-500 rounded text-paper text-sm px-3 py-1.5
                     w-[200px] max-w-full placeholder:text-mist-500 focus:border-paper focus:outline-none"
        />
      </div>
    </div>
  )
}
