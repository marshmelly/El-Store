import { app } from './config'
import { auth } from './auth'
import { db } from './firestore'
import { storage } from './firebase'

console.log('Firebase app:', app.name)
console.log('Firebase auth:', auth)
console.log('Firestore:', db)
console.log('Storage:', storage)