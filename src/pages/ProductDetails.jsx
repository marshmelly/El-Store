import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

// Firebase Firestore
// We need these to retrieve a single product from the products collection.
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfigFolder/firestore.js'


export default function ProductDetails() {

  // Gets the product ID from the URL.
  // Example:
  // /products/3d-8
  //
  // productId will therefore be "3d-8"
  const { productId } = useParams()

  // Get the cart and addToCart function from our CartContext.
  const { cart, addToCart } = useCart()


  // ---------------------------------------------------------
  // PRODUCT STATE
  // ---------------------------------------------------------
  //
  // Previously, the product was found inside products2D.js
  // and products3D.js.
  //
  // Now the product will come from Firestore instead.
  //

  const [product, setProduct] = useState(null)

  // Used to know whether Firebase is still loading the product.
  const [loading, setLoading] = useState(true)

  // Used to display an error if Firestore fails.
  const [error, setError] = useState('')


  // ---------------------------------------------------------
  // LOAD PRODUCT FROM FIRESTORE
  // ---------------------------------------------------------
  //
  // Whenever productId changes, this runs again.
  //
  // For example:
  //
  // /products/3d-8
  //       ↓
  // productId = "3d-8"
  //       ↓
  // Firestore looks inside:
  // products/3d-8
  //

  useEffect(() => {

    async function loadProduct() {

      try {

        // Tell React that we are currently loading.
        setLoading(true)

        // Clear any previous error.
        setError('')


        // Create a reference to:
        //
        // Firestore
        //   └── products
        //        └── productId
        //
        // If productId is "3d-8", this becomes:
        //
        // products/3d-8

        const productRef = doc(
          db,
          'products',
          productId
        )


        // Ask Firestore for that document.
        const productSnapshot = await getDoc(productRef)


        // ---------------------------------------------------
        // CHECK IF PRODUCT EXISTS
        // ---------------------------------------------------

        if (!productSnapshot.exists()) {

          // Product doesn't exist.
          setProduct(null)

          return
        }


        // Get the actual product data from Firestore.
        const productData = productSnapshot.data()


        // ---------------------------------------------------
        // CHECK IF PRODUCT IS ACTIVE
        // ---------------------------------------------------
        //
        // Our Firestore rules allow the public store to read
        // active products.
        //
        // We also check it here so that an inactive product
        // doesn't get displayed by the page.
        //

        if (!productData.active) {

          setProduct(null)

          return
        }


        // ---------------------------------------------------
        // SAVE PRODUCT INTO REACT STATE
        // ---------------------------------------------------
        //
        // Firestore gives us the document ID separately.
        //
        // We add it back into the product object so that:
        //
        // product.id
        //
        // still works everywhere else in the component.

        setProduct({
          ...productData,
          id: productSnapshot.id,
        })

      } catch (error) {

        console.error(
          'Failed to load product:',
          error
        )

        setError(
          'Unable to load product.'
        )

      } finally {

        // Loading is finished whether it succeeded or failed.
        setLoading(false)
      }
    }


    // Run the function.
    loadProduct()

  }, [productId])


  // ---------------------------------------------------------
  // LOADING SCREEN
  // ---------------------------------------------------------
  //
  // While Firebase is retrieving the product, product is
  // still null.
  //
  // We don't want to immediately show "Product not found"
  // while Firebase is still loading.
  //

  if (loading) {

    return (
      <main className="max-w-page mx-auto px-5 py-20">

        <div className="text-center">

          <p className="text-sm font-medium tracking-wide text-mist-500">
            LOADING PRODUCT...
          </p>

        </div>

      </main>
    )
  }


  // ---------------------------------------------------------
  // ERROR SCREEN
  // ---------------------------------------------------------

  if (error) {

    return (
      <main className="max-w-page mx-auto px-5 py-20">

        <div className="text-center">

          <h1 className="text-2xl font-semibold mb-4">
            Something went wrong
          </h1>

          <p className="text-mist-500 mb-6">
            {error}
          </p>

          <Link
            to="/"
            className="underline underline-offset-4"
          >
            Return home
          </Link>

        </div>

      </main>
    )
  }


  // ---------------------------------------------------------
  // PRODUCT NOT FOUND
  // ---------------------------------------------------------
  //
  // This happens if:
  //
  // 1. The product ID doesn't exist in Firestore
  // OR
  // 2. The product exists but active === false
  //

  if (!product) {

    return (
      <main className="max-w-page mx-auto px-5 py-20">

        <div className="text-center">

          <h1 className="text-2xl font-semibold mb-4">
            Product not found
          </h1>

          <Link
            to="/"
            className="underline underline-offset-4"
          >
            Return home
          </Link>

        </div>

      </main>
    )
  }


  // ---------------------------------------------------------
  // PRODUCT INFORMATION
  // ---------------------------------------------------------

  // A product with price 0 is considered free.
  const isFree = product.price === 0


  // We no longer need to check:
  //
  // product.id.startsWith('3d-')
  //
  // because our Firestore schema already has:
  //
  // type: "2D"
  // or
  // type: "3D"
  //
  // This is cleaner and more reliable.

  const is3D = product.type === '3D'


  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (

    <main className="max-w-page mx-auto px-5 py-10 md:py-16">


      {/* ---------------------------------------------------
          BACK BUTTON
          ---------------------------------------------------
          
          Sends the customer back to the correct product
          category.
      --------------------------------------------------- */}

      <Link
        to={is3D ? '/3d-assets' : '/2d-artworks'}
        className="inline-block text-sm mb-8 underline underline-offset-4"
      >
        ← Back to {is3D ? '3D Assets' : '2D Artworks'}
      </Link>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">


        {/* =================================================
            PRODUCT IMAGE
            ================================================= */}

        <div className="bg-mist-100 rounded-sm overflow-hidden">

          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="w-full h-full max-h-[700px] object-cover"
          />

        </div>


        {/* =================================================
            PRODUCT INFORMATION
            ================================================= */}

        <div className="flex flex-col justify-center">


          {/* Product category */}

          <p className="text-xs uppercase tracking-[0.18em] text-mist-500 mb-3">
            {product.category}
          </p>


          {/* Product title */}

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-5">
            {product.title}
          </h1>


          {/* Product price */}

          <div className="text-xl mb-8">

            {isFree
              ? 'FREE'
              : `$${product.price}`}

          </div>


          {/* -------------------------------------------------
              DESCRIPTION
              -------------------------------------------------
              
              We now use the description stored in Firestore.

              If description is empty, we use a fallback.
          ------------------------------------------------- */}

          <p className="text-mist-600 leading-relaxed mb-8">

            {product.description ||
              (isFree
                ? 'This digital asset is available for free download.'
                : 'A digital asset available for personal and creative projects.')
            }

          </p>


          {/* =================================================
              PRODUCT DETAILS
              ================================================= */}

          <div className="border-t border-mist-200 pt-6 mb-8">


            {/* Category */}

            <div className="flex justify-between py-2">

              <span className="text-mist-500">
                Category
              </span>

              <span>
                {product.category}
              </span>

            </div>


            {/* Type */}

            <div className="flex justify-between py-2">

              <span className="text-mist-500">
                Type
              </span>

              <span>
                {is3D ? '3D Asset' : '2D Artwork'}
              </span>

            </div>


            {/* -------------------------------------------------
                3D FORMATS
                -------------------------------------------------
                
                Only show this section if the product actually
                has formats stored in Firestore.
            ------------------------------------------------- */}

            {is3D && product.formats?.length > 0 && (

              <div className="flex justify-between py-2">

                <span className="text-mist-500">
                  Formats
                </span>

                <span>
                  {product.formats.join(', ')}
                </span>

              </div>

            )}


            {/* -------------------------------------------------
                SOFTWARE
                -------------------------------------------------
                
                Only show this for 3D products that have
                software information.
            ------------------------------------------------- */}

            {is3D && product.software?.length > 0 && (

              <div className="flex justify-between py-2">

                <span className="text-mist-500">
                  Software
                </span>

                <span>
                  {product.software.join(', ')}
                </span>

              </div>

            )}


            {/* Version */}

            <div className="flex justify-between py-2">

              <span className="text-mist-500">
                Version
              </span>

              <span>
                {product.version || '1.0'}
              </span>

            </div>

          </div>


          {/* =================================================
              PURCHASE / DOWNLOAD BUTTON
              ================================================= */}

          {isFree ? (

            /* -----------------------------------------------
               FREE PRODUCT
               ----------------------------------------------- */

            <button
              type="button"
              className="w-full bg-ink text-paper py-4 rounded-sm font-medium hover:opacity-90 transition-opacity"
              onClick={() => {

                // We are NOT implementing the real download
                // system yet.
                //
                // The actual asset will eventually come from
                // Firebase Storage.
                console.log(
                  'Free download:',
                  product.id
                )

              }}
            >
              DOWNLOAD FREE
            </button>

          ) : (

            /* -----------------------------------------------
               PAID PRODUCT
               ----------------------------------------------- */

            <button
              type="button"
              className="w-full bg-ink text-paper py-4 rounded-sm font-medium hover:opacity-90 transition-opacity"
              onClick={() => {

                // Add the Firestore product to the cart.
                addToCart(product)

              }}
            >

              {cart.some(
                (item) => item.id === product.id
              )
                ? 'ADDED TO CART'
                : `ADD TO CART — $${product.price}`}

            </button>

          )}

        </div>

      </div>

    </main>
  )
}

