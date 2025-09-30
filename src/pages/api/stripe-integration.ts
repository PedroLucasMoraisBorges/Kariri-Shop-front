import { api } from '@/lib/axios'

export async function createStripeSession(id: string) {
  const token = localStorage.getItem('access_token')

  const response = await api.get(`/stripe/createSession/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function createStripeSessionCart(id: string) {
  const token = localStorage.getItem('access_token')

  const response = await api.get(`/stripe/createCartSession/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
