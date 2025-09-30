import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { getCompanyProducts } from '@/pages/api/get-company-products'

export function CompanyProducts() {
  const [products, setProducts] = useState<
    {
      id: string
      name_product: string
      ProductImage: [{ id: string; path: string }]
    }[]
  >([])

  useEffect(() => {
    async function loadProducts() {
      const response = await getCompanyProducts()
      setProducts(response)
    }

    loadProducts()
  }, [])

  return (
    <>
      <Helmet title="Meus Produtos" />
      <div className="space-y-4 p-8">
        {products.map((element) => (
          <div key={element.id} className="flex items-center justify-between">
            <p>{element.name_product}</p>
            <img
              src={'http://localhost:3000/' + element.ProductImage[0].path}
              alt=""
            />
            <button className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
              Comprar
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
