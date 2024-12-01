import { httpClient } from '@/lib/api/api'

export type CreateContract = {
  lessor_id: string
  tenant_id: string
  start_date: string
  end_date?: string
  monthly_rent: number
  due_day: number
  security_deposit?: number
  status: string
}

export type Contract = {
  id: string
  lessor_id: string
  tenant_id: string
  start_date: string
  end_date?: string
  monthly_rent: number
  due_day: number
  security_deposit?: number
  status: string
}

export type ListContractParams = {
  lessor_id?: string
  tenant_id?: string
}

export type Response<T> = {
  data: T
}

export const createContract = async (
  dto: CreateContract,
): Promise<Contract> => {
  const response = await httpClient.post<Contract>('/contracts', dto)
  return response.data
}

export const getContracts = async (
  params?: ListContractParams,
): Promise<Contract[]> => {
  const response = await httpClient.get<Contract[]>('/contracts', {
    params,
  })
  return response.data
}
