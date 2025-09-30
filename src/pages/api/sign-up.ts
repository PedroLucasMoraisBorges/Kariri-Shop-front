import { api } from '@/lib/axios'

export interface RegisterUser {
  email: string
  complete_name: string
  password1: string
  password2: string
}

export async function signUp(register: RegisterUser) {
  await api.post('/auth/create', register)
}
