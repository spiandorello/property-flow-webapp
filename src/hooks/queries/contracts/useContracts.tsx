import { useQuery } from '@tanstack/react-query'
import {
  getContracts,
  ListContractParams,
  Contract,
} from '@/services/contracts/service'

export const useListContracts = (params?: ListContractParams) => {
  return useQuery<Contract[], Error>({
    queryKey: ['contracts', params],
    queryFn: () => getContracts(params),
  })
}
