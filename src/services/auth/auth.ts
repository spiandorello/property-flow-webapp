import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  type Auth,
  type UserCredential,
} from 'firebase/auth'

type SignInParams = {
  email: string
  password: string
}

const firebaseConfig = {
  apiKey: 'AIzaSyAbv8k8HsZn72p1KOQQnMJBd7a3NTgHsd4',
  authDomain: 'property-flow-36eb1.firebaseapp.com',
  projectId: 'property-flow-36eb1',
  storageBucket: 'property-flow-36eb1.firebasestorage.app',
  messagingSenderId: '155500109653',
  appId: '1:155500109653:web:094901a909593d4426d9dc',
  measurementId: 'G-WZFRCSLQ8S',
}

initializeApp(firebaseConfig)

export async function signIn({ email, password }: SignInParams) {
  const auth: Auth = getAuth()

  const credentials: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  )

  console.log(credentials)
}
