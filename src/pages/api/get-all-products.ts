import { api } from '@/lib/axios'

export async function getTopRatedProduct() {
  const response = await api.get('/product/getTopRatedProduct')
  return response.data
}

export async function getOffersDay() {
  const response = await api.get('/product/getOffersDay')
  return response.data
}

export async function getTopOfferDay() {
  const response = await api.get('/product/getOfferDay')
  return response.data
}

export async function getRecomendedProductsForLoggedUser(token: string) {
  const response = await api.get(
    `/product/getRecomendedProductsForLoggedUser`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}

export async function getProductInfo(prodId: string) {
  const response = await api.get(`/product/getProductInfo/${prodId}`)

  return response.data
}

export async function getSimilarProducts(id: string) {
  const response = await api.get(`/product/getSimilarProducts/${id}`)

  return response.data
}

export interface EvaluateBody {
  title_comment: string
  evaluation: number
  comment: string
}
type EvaluatePayload = EvaluateBody & { id: string }

export async function evaluateProduct({ id, ...data }: EvaluatePayload) {
  try {
    const token = localStorage.getItem('access_token')
    await api.post(`/product/evaluateProduct/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.data) {
      if (Array.isArray(error.response.data.message)) {
        console.log(error.response.data.message)
        return { errors: error.response.data.message }
      }
    } else {
      console.error('Erro desconhecido:', error)
    }
  }
}

export async function getEvaluationsProduct(id: string) {
  const response = await api.get(`/product/getEvaluates/${id}`)
  return response.data
}

export async function getFkCompanyProductIfno(id: string) {
  const response = await api.get(`/company/getInfoFromProduct/${id}`)
  return response.data
}

export async function getProductsFromCategory(id: string) {
  const response = await api.get(`/product/getProductsFromCategory/${id}`)
  return response.data
}

export async function searchProducts(search: string) {
  const response = await api.get(`/product/getProductsSearch/${search}`)
  return response.data
}
export async function getProductsFromSubCategory(id: string) {
  const response = await api.get(`/product/getProductsFromSubCategory/${id}`)
  return response.data
}

export interface FilterBody {
  price_range_min?: number
  price_range_max?: number
  evaluation_range?: number
  discount_range?: number
  sort_by_value?: boolean
  sort_by_evaluation?: boolean
  search_value?: string
}

export async function filterProducts(body: FilterBody) {
  const response = await api.post(`/product/filterProducts/`, body, {})
  return response.data
}
