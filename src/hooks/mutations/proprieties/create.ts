import { useMutation, useQueryClient } from '@tanstack/react-query'
import { appendLessor, create } from '@/services/properties/service'
import {
  CreatePropertiesRequest,
  CreatePropertiesResponse,
  Properties,
} from '@/hooks/queries/proprieties/useProperties'

export const useCreateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation<CreatePropertiesResponse, Error, CreatePropertiesRequest>({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

export const useAppendLessor = () => {
  const queryClient = useQueryClient()

  return useMutation<
    Properties,
    Error,
    { propertyID: string; lessorID: string }
  >({
    mutationFn: ({ propertyID, lessorID }) =>
      appendLessor(propertyID, lessorID),
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
