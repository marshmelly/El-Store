import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

import { db } from '../firebaseConfigFolder/firestore.js'

const ordersRef = collection(db, 'orders')

export async function getUserOrders(userId) {
  if (!userId) {
    return []
  }

  const ordersQuery = query(
    ordersRef,
    where('userId', '==', userId)
  )

  const snapshot = await getDocs(ordersQuery)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}