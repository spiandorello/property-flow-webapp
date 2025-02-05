'use server'
import { httpClient } from '@/lib/api/api'
import { APIResponse } from '@/models/model'
import { Address } from '@/hooks/queries/proprieties/useProperties'

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
    address: Address
  }
  lessor: {
    id: string
    name: string
    email?: string
    phone?: string
    registration_code: string
  }
  tenant: {
    id: string
    name: string
    email?: string
    phone?: string
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

export type GetContractParams = {
  id: string
}

export type ExpanseCategoryDTO = {
  id: string
  name: string
}

export type ContractExpanseDTO = {
  id: string
  amount: number
  description: string
  category: ExpanseCategoryDTO
}

export type CreateContractExpanseDTO = {
  amount: number
  description: string
  category_id: string
}

export const createContract = async (
  data: CreateContract,
): Promise<Contract> => {
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
  return response.data
}

export const getContract = async (
  params: GetContractParams,
): Promise<Contract> => {
  const response = await httpClient.get<Contract>(`/ws/contracts/${params.id}`)
  return response.data
}

export const listContractExpanses = async (
  contractId: string,
): Promise<APIResponse<ContractExpanseDTO[]>> => {
  const response = await httpClient.get<APIResponse<ContractExpanseDTO[]>>(
    `/ws/contracts/${contractId}/expanse`,
  )
  return response.data
}

export const createContractExpanse = async (
  contractId: string,
  data: CreateContractExpanseDTO,
): Promise<ContractExpanseDTO> => {
  const response = await httpClient.post<ContractExpanseDTO>(
    `/ws/contracts/${contractId}/expanse`,
    data,
  )
  return response.data
}
