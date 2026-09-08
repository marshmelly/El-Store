import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'el-store-cart'

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)

    if (!savedCart) {
      return []
    }

    return JSON.parse(savedCart)
  } catch (error) {
    console.error('Unable to load cart:', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getInitialCart)

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    )
  }, [cart])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const alreadyInCart = currentCart.some(
        (item) => item.id === product.id
      )

      if (alreadyInCart) {
        return currentCart
      }

      return [...currentCart, product]
    })
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, product) => total + Number(product.price || 0),
      0
    )
  }, [cart])

  const cartCount = cart.length

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}