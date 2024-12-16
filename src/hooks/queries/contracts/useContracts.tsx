import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  getContracts,
  ListContractParams,
  Contract,
  GetContractParams,
  getContract,
} from '@/services/contracts/service'
import { APIResponse } from '@/models/model'

export const useListContracts = (
  params?: ListContractParams,
  options?: UseQueryOptions<
    APIResponse<Contract[]>,
    Error,
    APIResponse<Contract[]>,
    QueryKey
  >,
) => {
  return useQuery<APIResponse<Contract[]>, Error>({
    queryKey: ['contracts', params],
    queryFn: () => getContracts(params),
    ...options,
  })
}

export const useContract = (
  params: GetContractParams,
  options?: UseQueryOptions<Contract, Error, Contract, QueryKey>,
) => {
  return useQuery<Contract, Error>({
    queryKey: ['contracts', params],
    queryFn: () => getContract(params),
    ...options,
  })
}
