'use server'
import { ListPropertiesResponse } from '@/hooks/queries/proprieties/useProperties'
import { httpClient } from '@/lib/api/api'
export async function getProperties(): Promise<ListPropertiesResponse> {
  try {
    const response =
      await httpClient.get<ListPropertiesResponse>('/ws/properties')
    return response.data
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw error
  }
}
