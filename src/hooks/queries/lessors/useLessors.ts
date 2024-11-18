import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getByRegistrationCode } from '@/services/lessors/service'

export type Lessor = {
  name: string
  contacts: {
    type: string
    contact: string
  }[]
  registration_code: string
  notes?: string
}

export type GetLessorByRegistrationCodeRequest = {
  registrationCode: string
}

export type GetLessorByRegistrationCodeResponse = {
  data: Lessor
}

const lessorsKey = 'lessors'

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
