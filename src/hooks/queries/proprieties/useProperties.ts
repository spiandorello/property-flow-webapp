import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { list, get, search } from '@/services/properties/service'

export type Lessor = {
  name: string
  contacts: {
    type: string
    contact: string
  }[]
  registration_code: string
  notes?: string
}

export type Address = {
  street: string
  number: string
  zip_code: string
  complement: string
  neighborhood: string
}

export type Properties = {
  id: string
  type: string
  code: string
  address: Address
  year: string
  lessor?: Lessor
}

export type ListPropertiesRequest = {
  id?: string
}

export type APIResponse<T> = {
  data: T
}
export type ListPropertiesResponse = {
  data: Properties[]
}

export type SearchPropertiesRequest = {
  code?: string
}

// type contact = {
//   type: string
//   contact: string
// }

export type CreatePropertiesResponse = {
  id: string
  code: string
}

export type CreatePropertiesRequest = {
  type: string
  code: string
  year: string
  address: {
    street: string
    number: string
    zip_code: string
    complement?: string
    neighborhood: string
  }
}

const propertiesKey = 'properties'

export const useListProperties = (
  params?: ListPropertiesRequest,
  options?: UseQueryOptions<
    ListPropertiesResponse,
    Error,
    ListPropertiesResponse,
    QueryKey
  >,
) => {
  return useQuery<ListPropertiesResponse>({
    queryKey: [propertiesKey, params],
    queryFn: list,
    ...options,
  })
}

export type PropertyRequest = {
  id: string
}

export const useProperty = (
  params: PropertyRequest,
  options?: UseQueryOptions<Properties, Error, Properties, QueryKey>,
) => {
  return useQuery<Properties>({
    queryKey: [propertiesKey, params],
    queryFn: () => get(params),
    ...options,
  })
}
export const useSearchProperties = (
  params: SearchPropertiesRequest,
  options?: UseQueryOptions<
    APIResponse<Properties[]>,
    Error,
    APIResponse<Properties[]>,
    QueryKey
  >,
) => {
  return useQuery<APIResponse<Properties[]>>({
    queryKey: ['searchProperties', params],
    queryFn: () => search(params),
    ...options,
  })
}
