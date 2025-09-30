import { api } from '@/lib/axios'

export async function getCompanyProducts() {
  // Recupera o token do armazenamento local (ou do estado)
  const token = localStorage.getItem('access_token')

  // Faz a requisição passando o token no cabeçalho
  const response = await api.get('/product/getAllCompanyProducts', {
    headers: {
      Authorization: `Bearer ${token}`, // Passa o token como Bearer Token
    },
  })

  return response.data
}
