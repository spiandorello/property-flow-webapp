import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { create } from '@/services/properties/service'
import { CreatePropertiesRequest } from '@/hooks/queries/proprieties/useProperties'

export const useCreateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation<UseMutationOptions, Error, CreatePropertiesRequest>({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
