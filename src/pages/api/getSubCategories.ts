import { api } from '@/lib/axios'

export async function getSubCategories(id: string) {
  const response = await api.get(`/product/getSubCategories/${id}`)
  return response.data
}

export async function getCategories() {
  const response = await api.get('/product/getCategories')
  return response.data
}
