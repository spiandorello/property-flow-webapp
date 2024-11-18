import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { list } from '@/services/properties/service'

export type Lessor = {
  name: string
  contacts: {
    type: string
    contact: string
  }[]
  registration_code: string
  notes?: string
}

export type Properties = {
  id: string
  type: string
  code: string
  address: string
  year: string
  lessor: Lessor
}

export type ListPropertiesRequest = {
  id?: string
}

export type ListPropertiesResponse = {
  data: Properties[]
}

// type contact = {
//   type: string
//   contact: string
// }

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
  // lessor: {
  //   name: string
  //   contacts: contact[]
  //   registration_code: string
  //   notes?: string
  // }
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
