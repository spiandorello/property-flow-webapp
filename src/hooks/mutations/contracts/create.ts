import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createContract,
  CreateContract,
  Contract,
} from '@/services/contracts/service'

export const useCreateContract = () => {
  const queryClient = useQueryClient()

  return useMutation<Contract, Error, CreateContract>({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
