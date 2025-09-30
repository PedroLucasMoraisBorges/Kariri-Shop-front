import { api } from '@/lib/axios'

export async function activateUser(id: string) {
  const response = await api.get(`/auth/validate/${id}`)
  return response.data
}
