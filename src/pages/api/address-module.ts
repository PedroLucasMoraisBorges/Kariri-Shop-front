import { api } from '@/lib/axios'

export async function getPrincipalAddress() {
  // Recupera o token do armazenamento local (ou do estado)
  const token = localStorage.getItem('access_token')

  const response = await api.get('/customUser/getPrincipalAddress', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function markToPickUpInStore() {
  const token = localStorage.getItem('access_token')

  const response = await api.put(`/customUser/markToPickUpInStore/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function markAddressAsPrincipal(addressId: string) {
  const token = localStorage.getItem('access_token')

  const response = await api.put(
    `/customUser/markPrincipalAddress/${addressId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}

export async function getMyAddress() {
  const token = localStorage.getItem('access_token')

  const response = await api.get(`/customUser/getMyAddresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export interface RegisterAddress {
  road: string
  cep: string
  number: number
  neighborhood: string
  city: string
  state: string
}

export async function createAddress(register: RegisterAddress) {
  const token = localStorage.getItem('access_token')

  try {
    await api.post('/customUser/createAddress', register, {
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

export async function getAddrressInfo(id: string) {
  const token = localStorage.getItem('access_token')

  const response = await api.get(`/customUser/getAddressInfo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export interface EditAddress {
  id: string
  road: string
  cep: string
  number: number
  neighborhood: string
  city: string
  state: string
}

export async function editAddress(form: EditAddress) {
  const token = localStorage.getItem('access_token')

  try {
    await api.put(`/customUser/editAddress/${form.id}`, form, {
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
