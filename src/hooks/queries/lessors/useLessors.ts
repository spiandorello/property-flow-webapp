import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getByRegistrationCode, list, search } from '@/services/lessors/service'

export type LessorContact = {
  type: string
  contact: string
}

export type Lessor = {
  id: string
  name: string
  contacts: LessorContact[]
  registration_code: string
  notes?: string
}

export type SearchLessor = {
  label: string
  value: string
}

export type SearchLessorRequest = {
  name?: string
  registration_code?: string
}

export type GetLessorByRegistrationCodeRequest = {
  registrationCode: string
}

export type GetLessorByRegistrationCodeResponse = {
  data: Lessor
}

export type CreateLessorRequest = {
  name: string
  contacts: {
    type: string
    contact: string
  }[]
  registration_code: string
  notes?: string
  property_id?: string
}

export type CreateLessorResponse = {
  id: string
  name: string
  contacts: {
    type: string
    contact: string
  }[]
  registration_code: string
  notes?: string
}

export type ListLessorRequest = {
  name?: string
}
export type ListLessorResponse = {
  data: Lessor[]
}

const lessorsKey = 'lessors'

export const useLessors = (
  params?: ListLessorRequest,
  options?: UseQueryOptions<
    ListLessorResponse,
    Error,
    ListLessorResponse,
    QueryKey
  >,
) => {
  return useQuery<ListLessorResponse>({
    queryKey: [lessorsKey, params],
    queryFn: () => list(params),
    ...options,
  })
}

export const useGetLessorByRegistrationCode = (
  params: GetLessorByRegistrationCodeRequest,
  options?: UseQueryOptions<
    GetLessorByRegistrationCodeResponse,
    Error,
    GetLessorByRegistrationCodeResponse,
    QueryKey
  >,
) => {
  return useQuery<GetLessorByRegistrationCodeResponse>({
    queryKey: [lessorsKey, params],
    queryFn: () => getByRegistrationCode(params),
    ...options,
  })
}

export const useSearchLessors = (
  params: SearchLessorRequest,
  options?: UseQueryOptions<SearchLessor[], Error, SearchLessor[], QueryKey>,
) => {
  return useQuery<SearchLessor[]>({
    queryKey: [lessorsKey, params],
    queryFn: () => search(params),
    ...options,
  })
}
