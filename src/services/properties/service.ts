'use server'
import {
  CreatePropertiesRequest,
  CreatePropertiesResponse,
  ListPropertiesResponse,
  PropertyRequest,
  Properties,
} from '@/hooks/queries/proprieties/useProperties'
import { httpClient } from '@/lib/api/api'

export async function get(params: PropertyRequest): Promise<Properties> {
  try {
    const response = await httpClient.get<Properties>(
      '/ws/properties/' + params.id,
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw error
  }
}

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

export async function appendLessor(
  propertyID: string,
  lessorID: string,
): Promise<Properties> {
  try {
    const response = await httpClient.post<Properties>(
      `/ws/properties/${propertyID}/lessors`,
      { lessor_id: lessorID },
    )
    return response.data
  } catch (error) {
    console.error('Failed to append lessor to property:', error)
    throw error
  }
}

export const create = async (
  property: CreatePropertiesRequest,
): Promise<CreatePropertiesResponse> => {
  const response = await httpClient.post<CreatePropertiesResponse>(
    '/ws/properties',
    property,
  )
  return response.data
}
