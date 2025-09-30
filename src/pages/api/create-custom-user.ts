import { api } from '@/lib/axios'

export interface RegisterCustomUser {
  cpf: string
  birthday: Date
  road: string
  cep: string
  number: number
  neighborhood: string
  city: string
  state: string
}

export async function createCustomUser(register: RegisterCustomUser) {
  const token = localStorage.getItem('access_token')

  try {
    await api.post('/customUser/create', register, {
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
