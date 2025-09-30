import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import FilterFormComponent from '@/components/FilterForm'
import ProductCard from '@/components/Product'
import { filterProducts } from '@/pages/api/get-all-products'

type Product = {
  id: string
  name_product: string
  value: number
  is_on_discount: boolean
  description: string
  value_with_discount: number
  units?: number
  stock: number
  images: [{ id: string; path: string; fk_product: string }]
}

export function ProductSearch() {
  const [products, setProducts] = useState<Product[]>()

  const { search } = useParams<{ search: string }>()

  async function fetchProductsByInput(input: string) {
    const response = await filterProducts({ search_value: input })
    setProducts(response)
  }

  useEffect(() => {
    if (search) {
      fetchProductsByInput(search)
    }
  }, [search])
  return (
    <>
      <Helmet title="Produtos" />
      <div className="relative flex min-h-screen flex-col items-center gap-8 bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">Produtos</h1>

          <div className="flex gap-6">
            <FilterFormComponent onFilter={setProducts} searchValue={search} />

            <div className="flex w-full flex-wrap gap-3">
              {products
                ? products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductSearch
