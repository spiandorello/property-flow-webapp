'use server'
import {
  Tenant,
  CreateTenantRequest,
  CreateTenantResponse,
  ListTenantRequest,
  ListTenantResponse,
  SearchTenant,
  SearchTenantRequest,
  GetTenantByRegistrationCodeRequest,
} from '@/models/tenants/model'
import { httpClient } from '@/lib/api/api'

function removeSpecialCharacters(str: string): string {
  return str.replace(/[^a-zA-Z0-9 ]/g, '')
}

export async function getByRegistrationCode(
  params: GetTenantByRegistrationCodeRequest,
): Promise<Tenant> {
  try {
    const registrationCode = removeSpecialCharacters(params.registration_code)
    const response = await httpClient.get<Tenant>(
      `/ws/tenants/by-registration-code/${registrationCode}`,
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch tenant:', error)
    throw error
  }
}

export async function search(
  params: SearchTenantRequest,
): Promise<SearchTenant[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params.registration_code) {
      searchParams.append('registration_code', params.registration_code)
    }

    if (params.name) {
      searchParams.append('name', params.name)
    }

    const response = await httpClient.get<SearchTenant[]>(
      `/ws/tenants/search?${searchParams.toString()}`,
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw error
  }
}

export const list = async (
  params?: ListTenantRequest,
): Promise<ListTenantResponse> => {
  const searchParams = new URLSearchParams()
  if (params) {
    searchParams.append('registration_code', params?.name ?? '')
  }

  const response = await httpClient.get<ListTenantResponse>('/ws/tenants')
  return response.data
}

export const create = async (
  property: CreateTenantRequest,
): Promise<CreateTenantResponse> => {
  const response = await httpClient.post<CreateTenantResponse>(
    '/ws/tenants',
    property,
  )
  return response.data
}
