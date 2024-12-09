'use server'
import { httpClient } from '@/lib/api/api'
import { APIResponse } from '@/models/model'

export type CreateContractTenantDTO = {
  id: string | null
  name: string
  email?: string
  phone?: string
  registration_code: string
  notes?: string
}

export type CreateContract = {
  property_id: string
  tenant: CreateContractTenantDTO
  start_date: string
  end_date?: string
  monthly_rent: number
  due_day: number
  security_deposit?: number
}

export type Contract = {
  id: string
  property: {
    id: string
    code: string
    type: string
  }
  lessor: {
    id: string
    name: string
    registration_code: string
  }
  tenant: {
    id: string
    name: string
    registration_code: string
  }
  start_date: string
  end_date?: string
  monthly_rent: number
  due_day: number
  security_deposit?: number
  enabled: boolean
}

export type ListContractParams = {
  lessor_id?: string
  tenant_id?: string
}

export const createContract = async (
  data: CreateContract,
): Promise<Contract> => {
  console.log(data)
  const response = await httpClient.post<Contract>('/ws/contracts', data)
  return response.data
}

export const getContracts = async (
  params?: ListContractParams,
): Promise<APIResponse<Contract[]>> => {
  const response = await httpClient.get<APIResponse<Contract[]>>(
    '/ws/contracts',
    {
      params,
    },
  )
  console.log(response.data)
  return response.data
}
