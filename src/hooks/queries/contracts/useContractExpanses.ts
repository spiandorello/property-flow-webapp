import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import {
  CreateContractExpanseDTO,
  ContractExpanseDTO,
  listContractExpanses,
  createContractExpanse,
} from '@/services/contracts/service'
import { APIResponse } from '@/models/model'

export const useListContractExpanses = (
  contractId: string,
  options?: UseQueryOptions<APIResponse<ContractExpanseDTO[]>, Error>,
) => {
  return useQuery<APIResponse<ContractExpanseDTO[]>, Error>({
    queryKey: ['contractExpanses', contractId],
    queryFn: () => listContractExpanses(contractId),
    ...options,
  })
}

export const useCreateContractExpanse = (
  contractId: string,
  options?: UseMutationOptions<
    ContractExpanseDTO,
    Error,
    CreateContractExpanseDTO
  >,
) => {
  return useMutation<ContractExpanseDTO, Error, CreateContractExpanseDTO>({
    mutationFn: (data: CreateContractExpanseDTO) =>
      createContractExpanse(contractId, data),
    ...options,
  })
}
