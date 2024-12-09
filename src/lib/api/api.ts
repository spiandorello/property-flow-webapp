'use server'
import { cookies } from 'next/headers'
import axios from 'axios'

export const httpClient = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 1000,
})

httpClient.defaults.headers.post['Content-Type'] = 'application/json'

httpClient.interceptors.request.use(
  async (config) => {
    const cookiesStore = await cookies()
    const token = cookiesStore.get('PFW_AT')

    if (token) {
      config.headers['X-AUTH-TOKEN'] = token.value
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

httpClient.interceptors.response.use(
  (response) => {
    // Can be modified response
    return response
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error)
  },
)
