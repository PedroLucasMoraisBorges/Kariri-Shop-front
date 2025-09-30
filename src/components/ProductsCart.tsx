import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react'

type Product = {
  id: string
  productCartId?: string
  name_product: string
  value: number
  is_on_discount: boolean
  value_with_discount: number
  units?: number
  images: [{ id: string; path: string; fk_product: string }]
}

type ProductsCartProps = {
  products: Product[]
  onAddToCart: (productId: string) => Promise<void>
  onRemoveFromCart: (productId: string) => Promise<void>
}

export function ProductsCart({
  products,
  onAddToCart,
  onRemoveFromCart,
}: ProductsCartProps) {
  function calculateValue(value: number, units: number) {
    const totalProductValue = value * units
    return totalProductValue.toFixed(2)
  }

  return (
    <div className="flex w-2/3 flex-col">
      {products.map((product) => (
        <div key={product.id} className="mb-2 flex w-full">
          <img
            src={`http://localhost:3000/${product.images[0].path}`}
            alt="productImage"
            className="h-36 w-36"
          />

          <div className="flex w-full justify-between pl-8 pr-10 pt-3">
            <div className="flex h-4/5 flex-col justify-between">
              <p>{product.name_product}</p>

              <div className="flex w-24 justify-between">
                <button
                  onClick={() => {
                    if (product.productCartId) {
                      onRemoveFromCart(product.productCartId)
                    }
                  }}
                >
                  {product.units &&
                    (product.units >= 2 ? <MinusIcon /> : <TrashIcon />)}
                </button>

                <p className="text-xl">{product.units}</p>

                <button
                  onClick={() => {
                    if (product.productCartId) {
                      onAddToCart(product.productCartId)
                    }
                  }}
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            <div className="ml-auto flex items-start">
              <span className="text-sm">R$</span>
              <p className="text-lg font-semibold">
                {product.units && calculateValue(product.value, product.units)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductsCart
