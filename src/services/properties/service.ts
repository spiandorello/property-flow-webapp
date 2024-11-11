import { instance } from '@/lib/api/api'
import { ListPropertiesResponse } from '@/hooks/queries/proprieties/useProperties'

export function services() {
  const client = instance

  async function getProperties(): Promise<ListPropertiesResponse> {
    try {
      console.log('Fetching properties...', client)

      const response =
        await client.get<ListPropertiesResponse>('/ws/properties')
      return response.data
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      throw error // Rethrow the error or return a default value
    }
  }

  return {
    getProperties,
  }
}
