import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

import { db } from '../firebaseConfigFolder/firestore.js'

const productsRef = collection(db, 'products')

export async function getActiveProducts() {
  const productsQuery = query(
    productsRef,
    where('active', '==', true)
  )

  const snapshot = await getDocs(productsQuery)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }))
}