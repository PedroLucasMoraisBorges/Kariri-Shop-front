import { api } from '@/lib/axios'

export interface CreateProduct {
  name_product: string
  description: string
  value: number
  stock: number
  sub_category: string
  files: File[]
}

export async function createProduct(register: CreateProduct) {
  try {
    const token = localStorage.getItem('access_token')

    const formData = new FormData()
    formData.append('name_product', register.name_product)
    formData.append('description', register.description)
    formData.append('value', String(register.value))
    formData.append('stock', String(register.stock))
    formData.append('sub_category', register.sub_category)

    register.files.forEach((file: File) => {
      formData.append('files', file)
    })

    await api.post('/product/create', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
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
