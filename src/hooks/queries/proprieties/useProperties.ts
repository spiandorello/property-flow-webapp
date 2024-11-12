import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { list } from '@/services/properties/service'

export type Properties = {
  id: string
  type: string
  code: string
  address: string
  year: string
}

export type ListPropertiesRequest = {
  id?: string
}

export type ListPropertiesResponse = {
  data: Properties[]
}

export type CreatePropertiesRequest = {
  type: string
  code: string
  address: {
    street: string
    number: string
    zip_code: string
    complement?: string
    neighborhood: string
  }
  year: string
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
