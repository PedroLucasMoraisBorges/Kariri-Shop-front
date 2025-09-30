import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
  rememberMe?: boolean
}

export async function signIn(login: SignInBody) {
  const response = await api.post('auth/login', login)

  return response.data
}
