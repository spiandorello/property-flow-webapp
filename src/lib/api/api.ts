'use server'
import axios, { AxiosInstance } from 'axios'
import { cookies } from 'next/headers'

export const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 1000,
})

instance.interceptors.request.use(
  async (config) => {
    const cookiesStore = await cookies()
    const token = cookiesStore.get('PFW_AT')

    console.log(token)

    if (token) {
      config.headers.set('X-AUTH-TOKEN', token.value)
    }

    return config
  },
  (error) => {
    console.log('ma oi')
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    // Can be modified response
    return response
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error)
  },
)
