import { useState, useEffect } from 'react'
import FilterBar from '../components/FilterBar.jsx'
import ProductCard from '../components/ProductCard.jsx'

import { getActiveProducts } from '../services/productService.js'


// Filters displayed on the 3D Assets page.
//
// "Freebies" is determined by:
// price === 0
//
// It is NOT a Firestore category.
const FILTERS = [
  'All',
  'Models',
  'Rigged Models',
  'Freebies'
]


export default function Assets3D() {


  // ---------------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------------
  //
  // This stores the 3D products retrieved from Firestore.
  //

  const [products, setProducts] = useState([])


  // Used while Firestore is loading.

  const [loading, setLoading] = useState(true)


  // Used if Firestore returns an error.

  const [error, setError] = useState('')


  // ---------------------------------------------------------
  // FILTER / SEARCH STATE
  // ---------------------------------------------------------

  const [active, setActive] = useState('All')

  const [search, setSearch] = useState('')


  // ---------------------------------------------------------
  // LOAD PRODUCTS FROM FIRESTORE
  // ---------------------------------------------------------
  //
  // Instead of products3D.js, we now ask Firestore for
  // active products.
  //

  useEffect(() => {

    async function loadProducts() {

      try {

        setLoading(true)
        setError('')


        // Retrieve all active products.

        const allProducts = await getActiveProducts()


        // Only keep products whose type is "3D".

        const assets = allProducts.filter(
          (product) => product.type === '3D'
        )


        // Save the 3D products.

        setProducts(assets)

      } catch (error) {

        console.error(
          'Failed to load 3D products:',
          error
        )

        setError(
          'Unable to load 3D assets.'
        )

      } finally {

        setLoading(false)

      }
    }


    loadProducts()

  }, [])


  // ---------------------------------------------------------
  // FILTER PRODUCTS
  // ---------------------------------------------------------

  const filteredProducts = products.filter((product) => {


    // Category filter.

    const matchesCategory =
      active === 'All' ||
      (
        active === 'Freebies'
          ? product.price === 0
          : product.category === active
      )


    // Search filter.

    const matchesSearch =
      product.title
        ?.toLowerCase()
        .includes(search.toLowerCase())


    return matchesCategory && matchesSearch

  })


  // ---------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------

  if (loading) {

    return (
      <main className="max-w-page mx-auto px-5 py-20">

        <p className="text-center text-mist-500">
          LOADING 3D ASSETS...
        </p>

      </main>
    )

  }


  // ---------------------------------------------------------
  // ERROR STATE
  // ---------------------------------------------------------

  if (error) {

    return (
      <main className="max-w-page mx-auto px-5 py-20">

        <p className="text-center text-red-500">
          {error}
        </p>

      </main>
    )

  }


  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <>

      {/* Filter and search bar */}

      <FilterBar
        filters={FILTERS}
        active={active}
        onFilterChange={setActive}
        search={search}
        onSearchChange={setSearch}
      />


      <main className="max-w-page mx-auto p-0.5">


        {/* -------------------------------------------------
            EMPTY RESULT
            -------------------------------------------------
            
            IMPORTANT:
            We use filteredProducts, NOT "filtered".
        ------------------------------------------------- */}

        {filteredProducts.length === 0 ? (

          <p className="text-center py-20 px-5 text-mist-500">
            No 3D assets match your filters.
          </p>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5 grid-flow-dense">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product.id}

                id={product.id}

                // IMPORTANT:
                // Firestore uses "thumbnailUrl".
                //
                // The old products3D.js used "image".
                image={product.thumbnailUrl}

                title={product.title}

                price={product.price}
              />

            ))}

          </div>

        )}

      </main>

    </>
  )
}
