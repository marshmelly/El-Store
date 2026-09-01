import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'

import { getFirestore } from 'firebase/firestore'
import { app } from './config'

export const db = getFirestore(app)

export const productsCollection = collection(db, 'products')
export const ordersCollection = collection(db, 'orders')

export const getProduct = async (productId) => {
  const productRef = doc(db, 'products', productId)
  const snapshot = await getDoc(productRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection)

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }))
}

export { serverTimestamp }