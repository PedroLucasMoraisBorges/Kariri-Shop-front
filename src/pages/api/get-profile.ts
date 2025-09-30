import { api } from '@/lib/axios'

export interface GetProfileResponse {
  name: string
  email: string
  is_company: boolean
}

export async function getProfile() {
  // Recupera o token do armazenamento local (ou do estado)
  const token = localStorage.getItem('access_token')

  if (token) {
    // Faz a requisição passando o token no cabeçalho
    const response = await api.get<GetProfileResponse>('/auth/getUserInfo', {
      headers: {
        Authorization: `Bearer ${token}`, // Passa o token como Bearer Token
      },
    })

    return response.data
  }
}

export interface CustomUser {
  cpf: string
  name: string
  birthday: Date
  email: string
  accept_delivery: boolean
}

export async function getCustomUserInfo() {
  const token = localStorage.getItem('access_token')

  if (token) {
    // Faz a requisição passando o token no cabeçalho
    const response = await api.get<CustomUser>('/customUser/read', {
      headers: {
        Authorization: `Bearer ${token}`, // Passa o token como Bearer Token
      },
    })

    return response.data
  }
}
