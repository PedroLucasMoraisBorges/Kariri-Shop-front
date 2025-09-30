/* eslint-disable array-callback-return */
import { Star, StarHalf } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getEvaluationsProduct } from '@/pages/api/get-all-products'

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

type Evaluation = {
  id: string
  title: string
  comment: string
  evaluation: number
  user_name: string
}

type StarsProps = {
  isCard: boolean
  product: Product
}
export function Stars({ isCard, product }: StarsProps) {
  const [reviews, setReviews] = useState<Evaluation[]>([])
  const [rate, setRate] = useState(0)
  const [counts, setCounts] = useState(0)

  async function fetchReviews(id: string) {
    const response = await getEvaluationsProduct(id)
    setReviews(response)
  }

  useEffect(() => {
    fetchReviews(product.id)
  }, [product.id])

  function calculateRateAndCount(reviews: Evaluation[]) {
    setCounts(reviews.length)

    let initialRate = 0
    reviews.map((review) => {
      initialRate += review.evaluation
    })

    setRate(initialRate / reviews.length)
  }

  useEffect(() => {
    calculateRateAndCount(reviews)
  }, [reviews])

  const [roundedRate, setRoundedRate] = useState(0)
  const [fullStars, setFullStars] = useState(0)
  const [hasHalfStar, setHasHalfStar] = useState(false)
  const [totalStars] = useState(5)

  useEffect(() => {
    // Arredonda para o mais próximo de 0.5
    setRoundedRate(Math.round(rate * 2) / 2)
    setFullStars(Math.floor(roundedRate))
    setHasHalfStar(roundedRate % 1 !== 0)
  }, [rate, roundedRate])

  return (
    <div className="flex min-h-4 items-start">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {counts >= 1 ? (
            Array.from({ length: totalStars }).map((_, i) => {
              const index = i + 1

              if (index <= fullStars) {
                return <Star key={i} size={15} color="#F9B023" fill="#F9B023" />
              } else if (index === fullStars + 1 && hasHalfStar) {
                return (
                  <StarHalf key={i} size={15} color="#F9B023" fill="#F9B023" />
                )
              }
            })
          ) : (
            <div className="rounded-xl bg-green-400 p-0 px-2">
              <p className="text-sm">Sem avaliação</p>
            </div>
          )}
        </div>

        {!isCard && (
          <p className="text-slate-500">
            ({counts}) {counts === 1 ? 'Avaliação' : 'Avaliações'}
          </p>
        )}
      </div>
    </div>
  )
}

export default Stars
