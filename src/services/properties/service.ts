'use server'
import {
  CreatePropertiesRequest,
  ListPropertiesResponse,
} from '@/hooks/queries/proprieties/useProperties'
import { httpClient } from '@/lib/api/api'

export async function list(): Promise<ListPropertiesResponse> {
  try {
    const response =
      await httpClient.get<ListPropertiesResponse>('/ws/properties')
    return response.data
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw error
  }
}

export const create = async (property: CreatePropertiesRequest) => {
  const response = await httpClient.post('/ws/properties', property, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}
