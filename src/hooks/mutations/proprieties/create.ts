import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from '@/services/properties/service'
import {
  CreatePropertiesRequest,
  CreatePropertiesResponse,
} from '@/hooks/queries/proprieties/useProperties'

export const useCreateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation<CreatePropertiesResponse, Error, CreatePropertiesRequest>({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
