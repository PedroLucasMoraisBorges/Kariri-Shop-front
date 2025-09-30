type Product = {
  id: string
  name_product: string
  value: number
  is_on_discount: boolean
  value_with_discount: number
  units?: number
  images: [{ id: string; path: string; fk_product: string }]
}

type SaleInfoProps = {
  productsCart?: Product[]
  product?: Product
}

export function SaleInfo({ productsCart, product }: SaleInfoProps) {
  let length = 0
  let saleValue = '0.00'

  function totalValue(products: Product[]): number {
    return products.reduce((acc, product) => {
      const units = product.units ?? 1
      return acc + units * product.value
    }, 0)
  }

  function getSaleInfo(productsCart?: Product[], product?: Product) {
    if (productsCart?.length !== 0 && productsCart) {
      length = productsCart.length
      saleValue = totalValue(productsCart).toFixed(2)
    } else if (product) {
      length = 1
      saleValue = Number(product?.value ?? 0).toFixed(2)
    }
  }

  getSaleInfo(productsCart, product)

  return (
    <div className="grid grid-rows-3" style={{ gridTemplateRows: 'auto 60px' }}>
      <p className="text-xl">Subtotal ({length} produtos)</p>
      <p className="text-xl font-bold">R$ {saleValue}</p>
    </div>
  )
}

export default SaleInfo
