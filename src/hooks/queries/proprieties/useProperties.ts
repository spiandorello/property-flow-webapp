import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { services } from '@/services/properties/service'

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
  const service = services()

  return useQuery<ListPropertiesResponse>({
    queryKey: [propertiesKey, params],
    queryFn: () => service.getProperties(),
    ...options,
  })
}
