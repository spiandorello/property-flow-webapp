'use server'

import { cookies } from 'next/headers'

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  type Auth,
  type UserCredential,
} from 'firebase/auth'

import { ServiceError } from '@/exceptions'
import {
  AUTH_EXCEPTION_MESSAGES,
  AUTH_EXCEPTION_UNKNOWN,
} from '@/exceptions/types'

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

export async function signIn({ email, password }: SignInParams): Promise<void> {
  return new Promise((resolve, reject): void => {
    const auth: Auth = getAuth()

    async function onSuccess({ user }: UserCredential) {
      const cookiesStore = await cookies()
      cookiesStore.set('PFW_AT', await user?.getIdToken(), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      })
      cookiesStore.set('PFW_RT', user.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      })

      resolve()
    }

    function onFail(exception: { code?: string }): void {
      const { code = AUTH_EXCEPTION_UNKNOWN } = exception

      reject(
        new ServiceError(AUTH_EXCEPTION_MESSAGES?.[code], {
          code,
          cause: exception,
        }),
      )
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(onSuccess)
      .catch(onFail)
  })
}
