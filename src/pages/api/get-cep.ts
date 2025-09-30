import axios from 'axios'

interface CepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  estado: string
  erro?: boolean
}

export async function getCepInfo(cep: string) {
  try {
    const numericCep = cep.replace(/\D/g, '')
    const response = await axios.get<CepResponse>(
      `https://viacep.com.br/ws/${numericCep}/json/`,
    )

    if (response.data.erro) {
      throw new Error('CEP não encontrado.')
    }

    return {
      road: response.data.logradouro,
      neighborhood: response.data.bairro,
      city: response.data.localidade,
      state: response.data.estado,
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    throw error
  }
}
