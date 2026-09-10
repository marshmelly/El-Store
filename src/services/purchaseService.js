import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

import { db } from '../firebaseConfigFolder/firestore.js'

const purchasesRef = collection(db, 'purchases')

export async function getUserPurchases(userId) {
  if (!userId) {
    return []
  }

  const purchasesQuery = query(
    purchasesRef,
    where('userId', '==', userId)
  )

  const snapshot = await getDocs(purchasesQuery)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}