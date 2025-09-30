import { api } from '@/lib/axios'

export async function addToCart(id: string, units: number) {
  const token = localStorage.getItem('access_token')

  try {
    await api.get(`/product/addToCart/${id}/${units}`, {
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

export async function addUnitToCart(id: string) {
  const token = localStorage.getItem('access_token')

  try {
    await api.get(`/product/addUnitProductToCart/${id}`, {
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

export async function removeUnitFromCart(id: string) {
  const token = localStorage.getItem('access_token')

  try {
    await api.get(`/product/removeUnitProductCart/${id}`, {
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
