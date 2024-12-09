import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getByRegistrationCode } from '@/services/tenants/service'
import {
  GetTenantByRegistrationCodeRequest,
  Tenant,
} from '@/models/tenants/model'

const key = 'tenants'

export const useTenant = (
  params: GetTenantByRegistrationCodeRequest,
  options?: UseQueryOptions<Tenant, Error, Tenant, QueryKey>,
) => {
  return useQuery<Tenant>({
    queryKey: [key, params],
    queryFn: () => getByRegistrationCode(params),
    ...options,
  })
}
