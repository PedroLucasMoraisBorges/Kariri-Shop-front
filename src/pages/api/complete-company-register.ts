import { api } from '@/lib/axios'

export interface CompleteCompanyRegister {
  name_company: string
  description: string
  business_niche: string
}

export interface CompleteRegisterResponse {
  url: string
  updateCompany: {
    name_company: string
    description: string
    business_niche: string
  }
}

export async function completeRegister(register: CompleteCompanyRegister) {
  try {
    const token = localStorage.getItem('access_token')
    const response = await api.put('/company/completeRegister', register, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
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
