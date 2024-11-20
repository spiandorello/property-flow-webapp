'use server'
import {
  CreateLessorRequest,
  CreateLessorResponse,
  GetLessorByRegistrationCodeRequest,
  GetLessorByRegistrationCodeResponse,
  ListLessorRequest,
  ListLessorResponse,
  SearchLessor,
  SearchLessorRequest,
} from '@/hooks/queries/lessors/useLessors'
import { httpClient } from '@/lib/api/api'

export async function getByRegistrationCode(
  params: GetLessorByRegistrationCodeRequest,
): Promise<GetLessorByRegistrationCodeResponse> {
  try {
    const response = await httpClient.get<GetLessorByRegistrationCodeResponse>(
      `/ws/lessors/by-registration-code/${params.registrationCode}`,
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw error
  }
}

export async function search(
  params: SearchLessorRequest,
): Promise<SearchLessor[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params.registration_code) {
      searchParams.append('registration_code', params.registration_code)
    }

    if (params.name) {
      searchParams.append('name', params.name)
    }

    const response = await httpClient.get<SearchLessor[]>(
      `/ws/lessors/search?${searchParams.toString()}`,
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw error
  }
}

export const list = async (
  params?: ListLessorRequest,
): Promise<ListLessorResponse> => {
  const searchParams = new URLSearchParams()
  if (params) {
    searchParams.append('registration_code', params?.name ?? '')
  }

  const response = await httpClient.get<ListLessorResponse>('/ws/lessors')
  return response.data
}

export const create = async (
  property: CreateLessorRequest,
): Promise<CreateLessorResponse> => {
  const response = await httpClient.post<CreateLessorResponse>(
    '/ws/lessors',
    property,
  )
  return response.data
}
