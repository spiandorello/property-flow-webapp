import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getProperties } from '@/services/properties/service'

export type Properties = {
  id: string
}

export type ListPropertiesRequest = {
  id?: string
}

export type ListPropertiesResponse = {
  data: Properties[]
}

const propertiesKey = 'properties'

export const useListProperties = (
  params: ListPropertiesRequest,
  options?: UseQueryOptions<
    ListPropertiesResponse,
    Error,
    ListPropertiesResponse,
    QueryKey
  >,
) => {
  return useQuery<ListPropertiesResponse>({
    queryKey: [propertiesKey, params],
    queryFn: getProperties,
    ...options,
  })
}
