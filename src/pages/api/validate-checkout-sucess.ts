import { api } from '@/lib/axios'

export async function validateCheckoutSession(sessionId: string) {
  const token = localStorage.getItem('access_token')

  const response = await api.get(`/stripe/check-session/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
