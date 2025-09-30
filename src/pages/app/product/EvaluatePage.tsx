import { Label } from '@radix-ui/react-label'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { evaluateProduct, getProductInfo } from '@/pages/api/get-all-products'

const evaluateForm = z.object({
  note: z.number(),
  title: z.string(),
  comment: z.string(),
})

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

type EvaluateForm = z.infer<typeof evaluateForm>

export function EvaluatePage() {
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product>()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EvaluateForm>()

  const { mutateAsync: evaluateForm } = useMutation({
    mutationFn: evaluateProduct,
  })

  const { id } = useParams<{
    id: string
  }>()

  async function fetchProductInfo(id: string) {
    const response = await getProductInfo(id)
    setProduct(response)
  }

  useEffect(() => {
    if (id) {
      fetchProductInfo(id)
    }
  }, [id])

  async function handleRegister(data: EvaluateForm) {
    if (!id) {
      toast.error('ID não encontrado.')
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
    try {
      const response = await evaluateForm({
        id,
        title_comment: data.title,
        comment: data.comment,
        evaluation: data.note,
      })

      if (response?.errors) {
        response.errors.forEach((error: string) => {
          toast.error(error)
        })
      } else {
        toast.success('Avaliação feita com sucesso!')
        navigate(-1)
      }
    } catch {
      toast.error('Erro ao avaliar.')
    }
  }
  return (
    <>
      <Helmet title="Avaliar Produto" />
      <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-2/4 flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">Avaliar Produto</h1>

          {product && (
            <div className="flex items-start gap-2 border-b border-slate-300 pb-8">
              <img
                src={`http://localhost:3000/${product.images[0].path}`}
                alt=""
                className="w-2/12 rounded-md border p-1 shadow-md"
              />
              <p className="w-full text-lg">{product?.name_product}</p>
            </div>
          )}

          <form
            method="post"
            onSubmit={handleSubmit(handleRegister)}
            className="flex w-full flex-col gap-10"
          >
            <div className="grid w-full gap-2 border-b border-slate-300 pb-8">
              <Label htmlFor="note" className="cursor-pointer text-xl">
                Classificação
              </Label>
              <select
                id="note"
                required
                {...register('note', { valueAsNumber: true })}
                className="w-fit cursor-pointer rounded-md border border-input border-slate-400 py-2 pl-2 pr-10 text-sm shadow-sm"
              >
                <optgroup className="cursor-pointer">
                  <option value="" className="cursor-pointer text-slate-600">
                    Nota do produto
                  </option>

                  <option value={0.0}>0.0</option>
                  <option value={0.5}>0.5</option>
                  <option value={1.0}>1.0</option>
                  <option value={1.5}>1.5</option>
                  <option value={2.0}>2.0</option>
                  <option value={2.5}>2.5</option>
                  <option value={3.0}>3.0</option>
                  <option value={3.5}>3.5</option>
                  <option value={4.0}>4.0</option>
                  <option value={4.5}>4.5</option>
                  <option value={5.0}>5.0</option>
                </optgroup>
              </select>
            </div>
            <div className="grid w-full gap-2 border-b border-slate-300 pb-8">
              <Label htmlFor="title" className="cursor-pointer text-xl">
                Título da avaliação
              </Label>
              <Input
                id="title"
                type="string"
                required
                {...register('title')}
                placeholder="O que é mais importante saber?"
                className="rounded-md border border-input border-slate-400 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="comment" className="cursor-pointer text-xl">
                Descrição da avaliação
              </Label>
              <textarea
                id="comment"
                placeholder="Do que você gostou ou não gostou no produto? Por que você usa?"
                required
                className="min-h-[100px] resize-none rounded-md border border-input border-slate-400 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('comment')}
              />
            </div>

            <div className="flex justify-end">
              <button
                className="rounded-full bg-blue-800 p-1 px-6 font-semibold text-white"
                disabled={isSubmitting}
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EvaluatePage
