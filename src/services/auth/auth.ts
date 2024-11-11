'use client'
import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type UserCredential,
  User,
} from 'firebase/auth'

import { ErrCause, ServiceError } from '@/exceptions'
import {
  AUTH_EXCEPTION_MESSAGES,
  AUTH_EXCEPTION_UNKNOWN,
} from '@/exceptions/types'
import { Credentials } from '@/store/auth/auth'

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

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)

export async function signIn({
  email,
  password,
}: SignInParams): Promise<Credentials> {
  return new Promise((resolve, reject): void => {
    async function onSuccess({ user }: UserCredential) {
      resolve({
        accessToken: await user.getIdToken(),
        refreshToken: user.refreshToken,
      })
    }

    function onFail(exception: { code?: string }): void {
      const { code = AUTH_EXCEPTION_UNKNOWN } = exception as ErrCause

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

export async function onAuthChange(
  credentials: Credentials,
  callback: (credential: Credentials) => void,
): Promise<void> {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // const accessToken = await user.getIdTokenResult()
      //
      // console.log(credentials.accessToken === accessToken.token)
      // console.log(credentials.accessToken === accessToken)
      // if (credentials.accessToken === accessToken) {
      //   return
      // }
      //
      const refreshToken = await refresh(user)
      callback({ accessToken: refreshToken, refreshToken: user.refreshToken })
    }
  })
}

async function refresh(user: User): Promise<string> {
  try {
    const newIdToken = await user.getIdToken(true) // `true` forces token refresh

    return newIdToken
  } catch (error) {
    console.error('Failed to refresh token:', error)
    throw error
  }
}
