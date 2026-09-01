import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import { app } from './config'

export const auth = getAuth(app)

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const logoutUser = () => {
  return signOut(auth)
}