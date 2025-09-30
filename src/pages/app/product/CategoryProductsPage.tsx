import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { FilterFormComponent } from '@/components/FilterForm'
import ProductCard from '@/components/Product'
import { getProductsFromCategory } from '@/pages/api/get-all-products'
import { getSubCategories } from '@/pages/api/getSubCategories'

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

type SubCategory = {
  id: string
  sub_category_type: string
}

export function CategoryProductsPage() {
  const [products, setProducts] = useState<Product[]>()
  const [subCategories, setSubCategoies] = useState<SubCategory[]>([])

  const { id } = useParams<{ id: string }>()

  async function fethProductsFromCategory(id: string) {
    const response = await getProductsFromCategory(id)
    const subCategoriesResponse = await getSubCategories(id)

    setSubCategoies(subCategoriesResponse)
    setProducts(response)
  }

  useEffect(() => {
    if (id) {
      fethProductsFromCategory(id)
    }
  }, [id])
  return (
    <>
      <Helmet title="Produtos Por Categoria" />
      <div className="relative flex min-h-screen flex-col items-center gap-8 bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">
            Produtos por Categoria
          </h1>

          <div className="flex gap-6">
            <FilterFormComponent
              IdCategory={id}
              onFilter={setProducts}
              subCategories={subCategories}
            />

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

export default CategoryProductsPage
