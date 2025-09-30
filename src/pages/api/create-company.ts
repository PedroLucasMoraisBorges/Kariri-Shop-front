import { api } from '@/lib/axios'

export interface CreateCompany {
  cnpj?: string
  cpf?: string
  road: string
  cep: string
  number: string
  neighborhood: string
  city: string
  state: string
}

export async function createCompany(register: CreateCompany) {
  const token = localStorage.getItem('access_token')

  console.log(register)

  try {
    await api.post('/company/create', register, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.data) {
      if (Array.isArray(error.response.data.message)) {
        return { errors: error.response.data.message }
      }
    } else {
      console.error('Erro desconhecido:', error)
    }
  }
}
