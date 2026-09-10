import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

import serviceAccount from './serviceAccountKey.json' with { type: 'json' }

initializeApp({
  credential: cert(serviceAccount),
})

const email = process.argv[2]

if (!email) {
  console.error('Please provide the administrator email.')
  console.error('Example: node admin-tools/setAdmin.mjs you@example.com')
  process.exit(1)
}

try {
  const auth = getAuth()

  const user = await auth.getUserByEmail(email)

  await auth.setCustomUserClaims(user.uid, {
    admin: true,
  })

  console.log('----------------------------------------')
  console.log('Admin access granted successfully.')
  console.log(`Email: ${user.email}`)
  console.log(`UID: ${user.uid}`)
  console.log('Admin claim: true')
  console.log('----------------------------------------')
} catch (error) {
  console.error('Failed to grant admin access:', error)
  process.exit(1)
}