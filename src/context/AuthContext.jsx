import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signOut,
  getIdTokenResult,
} from 'firebase/auth'

import { auth } from '../firebaseConfigFolder/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser)

        if (!currentUser) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        try {
          /*
           * Get the Firebase ID token and inspect
           * the custom claims attached to it.
           *
           * forceRefresh=true makes sure we get the
           * newly assigned admin claim.
           */
          const tokenResult = await getIdTokenResult(
            currentUser,
            true
          )

          setIsAdmin(tokenResult.claims.admin === true)
        } catch (error) {
          console.error(
            'Failed to check admin status:',
            error
          )

          setIsAdmin(false)
        } finally {
          setLoading(false)
        }
      }
    )

    return unsubscribe
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}