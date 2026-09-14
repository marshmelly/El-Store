import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

// This is the single localStorage key used by the El-Store cart.
const CART_STORAGE_KEY = 'el-store-cart'


// ---------------------------------------------------------
// CREATE CART ITEM
// ---------------------------------------------------------
// We don't need to save the entire Firestore product.
// We only save the information needed to display the cart.
//
// productId is important because it identifies the actual
// Firestore product document.
// ---------------------------------------------------------

function createCartItem(product) {
  return {
    productId: product.id,
    title: product.title || 'Untitled product',
    type: product.type || '',
    category: product.category || '',
    price: Number(product.price || 0),

    // Your products currently use thumbnailUrl.
    // image is kept as a fallback for older products.
    thumbnailUrl:
      product.thumbnailUrl ||
      product.image ||
      '',

    // Every newly added product starts at quantity 1.
    quantity: 1,
  }
}


// ---------------------------------------------------------
// LOAD EXISTING CART
// ---------------------------------------------------------
// This runs when the application starts.
//
// It allows the cart to survive a browser refresh.
// ---------------------------------------------------------

function getInitialCart() {

  try {

    const savedCart =
      localStorage.getItem(CART_STORAGE_KEY)

    if (!savedCart) {
      return []
    }

    return JSON.parse(savedCart)

  } catch (error) {

    console.error(
      'Unable to load cart:',
      error
    )

    return []
  }
}


// ---------------------------------------------------------
// CART PROVIDER
// ---------------------------------------------------------

export function CartProvider({ children }) {

  const [cart, setCart] =
    useState(getInitialCart)


  // -------------------------------------------------------
  // SAVE CART
  // -------------------------------------------------------
  //
  // Whenever cart changes, save it to localStorage.
  //
  // This means:
  //
  // Add product
  //      ↓
  // cart changes
  //      ↓
  // localStorage updates
  //
  // -------------------------------------------------------

  useEffect(() => {

    try {

      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      )

    } catch (error) {

      console.error(
        'Unable to save cart:',
        error
      )
    }

  }, [cart])


  // -------------------------------------------------------
  // ADD TO CART
  // -------------------------------------------------------

  const addToCart = (product) => {

    // Don't add an invalid product.
    if (!product?.id) {
      return
    }


    // Don't allow an inactive product to be added.
    //
    // IMPORTANT:
    // Firestore security rules are still the real security
    // boundary. This is only the client-side protection.
    //
    if (product.active === false) {
      return
    }


    setCart((currentCart) => {

      // Look for the same product.
      const existingItem =
        currentCart.find(
          (item) =>
            item.productId === product.id
        )


      // ---------------------------------------------------
      // PRODUCT ALREADY EXISTS
      // ---------------------------------------------------
      //
      // Instead of creating a second line:
      //
      // Product A
      // Product A
      //
      // we create:
      //
      // Product A × 2
      //
      // ---------------------------------------------------

      if (existingItem) {

        return currentCart.map((item) =>

          item.productId === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item
        )
      }


      // ---------------------------------------------------
      // NEW PRODUCT
      // ---------------------------------------------------

      return [
        ...currentCart,
        createCartItem(product),
      ]
    })
  }


  // -------------------------------------------------------
  // UPDATE QUANTITY
  // -------------------------------------------------------

  const updateQuantity = (
    productId,
    quantity
  ) => {

    const nextQuantity =
      Number(quantity)


    // Quantity 0 means remove the product.
    if (
      !Number.isFinite(nextQuantity) ||
      nextQuantity <= 0
    ) {

      removeFromCart(productId)

      return
    }


    setCart((currentCart) =>

      currentCart.map((item) =>

        item.productId === productId

          ? {
              ...item,
              quantity:
                Math.floor(nextQuantity),
            }

          : item
      )
    )
  }


  // -------------------------------------------------------
  // INCREASE QUANTITY
  // -------------------------------------------------------

  const increaseQuantity = (productId) => {

    setCart((currentCart) =>

      currentCart.map((item) =>

        item.productId === productId

          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }

          : item
      )
    )
  }


  // -------------------------------------------------------
  // DECREASE QUANTITY
  // -------------------------------------------------------

  const decreaseQuantity = (productId) => {

    setCart((currentCart) =>

      currentCart

        .map((item) =>

          item.productId === productId

            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }

            : item
        )

        // If quantity becomes 0,
        // remove the item completely.
        .filter(
          (item) =>
            item.quantity > 0
        )
    )
  }


  // -------------------------------------------------------
  // REMOVE PRODUCT
  // -------------------------------------------------------

  const removeFromCart = (productId) => {

    setCart((currentCart) =>

      currentCart.filter(
        (item) =>
          item.productId !== productId
      )
    )
  }


  // -------------------------------------------------------
  // CLEAR CART
  // -------------------------------------------------------

  const clearCart = () => {

    setCart([])
  }


  // -------------------------------------------------------
  // CART COUNT
  // -------------------------------------------------------
  //
  // This counts individual items.
  //
  // Example:
  //
  // Product A × 2
  // Product B × 1
  //
  // cartCount = 3
  //
  // -------------------------------------------------------

  const cartCount = useMemo(() => {

    return cart.reduce(
      (count, item) =>
        count + item.quantity,
      0
    )

  }, [cart])


  // -------------------------------------------------------
  // CART TOTAL
  // -------------------------------------------------------
  //
  // price × quantity
  //
  // Example:
  //
  // $20 × 2 = $40
  //
  // -------------------------------------------------------

  const cartTotal = useMemo(() => {

    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
        item.quantity,
      0
    )

  }, [cart])


  // -------------------------------------------------------
  // PROVIDER VALUE
  // -------------------------------------------------------

  const value = {

    cart,

    cartCount,

    cartTotal,

    addToCart,

    updateQuantity,

    increaseQuantity,

    decreaseQuantity,

    removeFromCart,

    clearCart,
  }


  return (

    <CartContext.Provider value={value}>

      {children}

    </CartContext.Provider>
  )
}


// ---------------------------------------------------------
// USE CART HOOK
// ---------------------------------------------------------

export function useCart() {

  const context =
    useContext(CartContext)


  if (!context) {

    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }


  return context
}