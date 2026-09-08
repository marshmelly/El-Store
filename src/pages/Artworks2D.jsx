import { useState, useEffect } from 'react'
import FilterBar from '../components/FilterBar.jsx'
import ProductCard from '../components/ProductCard.jsx'

import { getActiveProducts } from '../services/productService.js'


// These are the filters shown in the UI.
//
// IMPORTANT:
// "Freebies" is NOT actually stored as a category in Firestore.
// A product is considered free when:
// price === 0
//
const FILTERS = ['All', 'Rasters', 'Vectors', 'Freebies']


export default function Artworks2D() {

  // ---------------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------------
  //
  // This will contain the 2D products retrieved from Firestore.
  //
  const [products, setProducts] = useState([])


  // Tells us whether Firestore is still loading.
  const [loading, setLoading] = useState(true)


  // Stores an error message if Firestore fails.
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
  // This replaces the old:
  //
  // import products2D from '../data/products2D'
  //
  // We now retrieve the products from Firestore.
  //

  useEffect(() => {

    async function loadProducts() {

      try {

        setLoading(true)
        setError('')


        // Get all active products from Firestore.
        const allProducts = await getActiveProducts()


        // We only want products whose type is "2D".
        const artworks = allProducts.filter(
          (product) => product.type === '2D'
        )


        // Save the 2D products into React state.
        setProducts(artworks)

      } catch (error) {

        console.error(
          'Failed to load 2D products:',
          error
        )

        setError('Unable to load artworks.')

      } finally {

        setLoading(false)

      }
    }


    loadProducts()

  }, [])


  // ---------------------------------------------------------
  // FILTER PRODUCTS
  // ---------------------------------------------------------
  //
  // This applies both:
  //
  // 1. Category filter
  // 2. Search
  //

  const filteredProducts = products.filter((product) => {


    // Category matching.
    //
    // Freebies are special because they are determined by
    // price === 0 instead of category === "Freebies".

    const matchesCategory =
      active === 'All' ||
      (
        active === 'Freebies'
          ? product.price === 0
          : product.category === active
      )


    // Search matching.
    //
    // ?. prevents an error if title is missing.

    const matchesSearch =
      product.title
        ?.toLowerCase()
        .includes(search.toLowerCase())


    return matchesCategory && matchesSearch

  })


  // ---------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------
  //
  // Don't show "No artworks..." while Firestore is still
  // retrieving the products.
  //

  if (loading) {

    return (
      <main className="max-w-page mx-auto px-5 py-20">

        <p className="text-center text-mist-500">
          LOADING ARTWORKS...
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
            We use filteredProducts here.

            Your previous code used:
            
            filtered.length
            
            but there was no variable called "filtered".
            That caused the page to crash.
        ------------------------------------------------- */}

        {filteredProducts.length === 0 ? (

          <p className="text-center py-20 px-5 text-mist-500">
            No artworks match your filters.
          </p>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5 grid-flow-dense">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product.id}

                id={product.id}

                // Firestore uses "thumbnailUrl".
                //
                // The old JavaScript data used "image".
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
