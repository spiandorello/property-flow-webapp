import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from '@/services/lessors/service'

import {
  CreateLessorRequest,
  CreateLessorResponse,
} from '@/hooks/queries/lessors/useLessors'

export const useCreateLessor = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateLessorResponse, Error, CreateLessorRequest>({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
