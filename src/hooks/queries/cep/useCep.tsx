import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { get } from '@/services/viacep/service'

export type UseCepRequest = {
  cep: string
}

export type UseCepResponse = {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

const cepKey = 'cep'

export const useCep = (
  params: UseCepRequest,
  options?: UseQueryOptions<UseCepResponse, Error, UseCepResponse, QueryKey>,
) => {
  return useQuery<UseCepResponse>({
    queryKey: [cepKey, params],
    queryFn: () => get(params),
    ...options,
  })
}
