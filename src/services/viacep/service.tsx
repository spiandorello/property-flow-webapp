import { UseCepRequest, UseCepResponse } from '@/hooks/queries/cep/useCep'

export async function get(params: UseCepRequest): Promise<UseCepResponse> {
  const { cep } = params

  if (!cep || !/^\d{8}$/.test(cep)) {
    console.log(cep)
    throw new Error('CEP inválido. Use o formato 12345678.')
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.ok) {
      throw new Error(`Erro ao buscar CEP: ${response.statusText}`)
    }

    const data = (await response.json()) as UseCepResponse

    // // Caso o ViaCEP retorne um CEP inexistente
    // if ((data as any).erro) {
    //   throw new Error('CEP não encontrado.')
    // }

    return data
  } catch (error) {
    console.error('Erro na busca do CEP:', error)
    throw new Error('Erro ao buscar o CEP.')
  }
}
