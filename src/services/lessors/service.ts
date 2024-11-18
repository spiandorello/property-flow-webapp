'use server'
import {
  GetLessorByRegistrationCodeRequest,
  GetLessorByRegistrationCodeResponse,
} from '@/hooks/queries/lessors/useLessors'
import { httpClient } from '@/lib/api/api'

export async function getByRegistrationCode(
  params: GetLessorByRegistrationCodeRequest,
): Promise<GetLessorByRegistrationCodeResponse> {
  try {
    const response = await httpClient.get<GetLessorByRegistrationCodeResponse>(
      `/ws/lessors/by-registration-code/${params.registrationCode}`,
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw error
  }
}
