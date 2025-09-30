import { api } from '@/lib/axios'

type Product = {
  id: string
  name_product: string
  value: number
  productCartId?: string
  is_on_discount: boolean
  value_with_discount: number
  units?: number
  images: [{ id: string; path: string; fk_product: string }]
}

export async function getShoppingCartProducts() {
  // Recupera o token do armazenamento local (ou do estado)
  const token = localStorage.getItem('access_token')

  const response = await api.get('/product/getProductsCart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function getSimilarProducts(products: Product[]) {
  const token = localStorage.getItem('access_token')
  const ids = products.map((p) => p.productCartId)

  const response = await api.post(
    '/product/getSimilarProductsForCart',
    { ids }, // envia o array no body JSON
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}

export async function getProductsFromSpecificShoppingCart(cartId: string) {
  const token = localStorage.getItem('access_token')

  const response = await api.get(
    `/product/getProductsEspecificCart/${cartId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}
