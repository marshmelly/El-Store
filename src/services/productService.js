import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../firebaseConfigFolder/firestore.js'


const PRODUCTS_COLLECTION = 'products'


/*
 * GET ALL ACTIVE PRODUCTS
 *
 * This is what the public website uses.
 *
 * Customers will only receive products where:
 *
 * active === true
 */
export async function getActiveProducts() {
  const productsRef = collection(db, PRODUCTS_COLLECTION)

  const productsQuery = query(
    productsRef,
    where('active', '==', true),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(productsQuery)

  return snapshot.docs.map((productDoc) => ({
    id: productDoc.id,
    ...productDoc.data(),
  }))
}


/*
 * GET ONE PRODUCT
 */
export async function getProductById(productId) {
  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    productId
  )

  const snapshot = await getDoc(productRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}


/*
 * GET ALL PRODUCTS
 *
 * Admin dashboard uses this.
 *
 * This includes inactive products because the administrator
 * needs to be able to see products that have been disabled.
 */
export async function getAllProducts() {
  const productsRef = collection(db, PRODUCTS_COLLECTION)

  const productsQuery = query(
    productsRef,
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(productsQuery)

  return snapshot.docs.map((productDoc) => ({
    id: productDoc.id,
    ...productDoc.data(),
  }))
}


/*
 * CREATE PRODUCT
 *
 * We use the supplied product ID rather than letting Firestore
 * generate a random ID.
 *
 * Example:
 *
 * 2D-001
 * 3D-001
 */
export async function createProduct(product) {
  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    product.id
  )

  await setDoc(productRef, {
    title: product.title,
    type: product.type,
    category: product.category,

    price: Number(product.price),

    thumbnailUrl: product.thumbnailUrl || '',
    imageUrl: product.imageUrl || '',

    active: product.active !== false,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}


/*
 * UPDATE PRODUCT
 */
export async function updateProduct(productId, updates) {
  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    productId
  )

  await updateDoc(productRef, {
    ...updates,
    price: Number(updates.price),
    updatedAt: serverTimestamp(),
  })
}


/*
 * CHANGE ACTIVE STATUS
 *
 * We don't delete a product just because it should temporarily
 * disappear from the store.
 *
 * Instead:
 *
 * active: false
 *
 * This is safer and preserves the product record.
 */
export async function setProductActive(productId, active) {
  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    productId
  )

  await updateDoc(productRef, {
    active,
    updatedAt: serverTimestamp(),
  })
}


/*
 * DELETE PRODUCT
 *
 * We are including this for the administrator.
 *
 * Later, once products have purchases attached to them,
 * we may choose to remove this option entirely and rely
 * only on active/inactive status.
 */
export async function deleteProduct(productId) {
  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    productId
  )

  await deleteDoc(productRef)
}