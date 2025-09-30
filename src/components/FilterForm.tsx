import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import debounce from 'lodash.debounce'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { filterProducts } from '@/pages/api/get-all-products'

import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'

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

type FilterFormProps = {
  IdCategory?: string
  onFilter?: (products: Product[]) => void
  subCategories?: SubCategory[]
  searchValue?: string
}

const filterFormSchema = z.object({
  price_range_min: z.number().optional(),
  price_range_max: z.number().optional(),
  evaluation_range: z.number().optional(),
  discount_range: z.number().optional(),
  sort_by_value: z.boolean().optional(),
  sort_by_evaluation: z.boolean().optional(),
  id_category: z.string().optional(),
  id_sub_category: z.string().optional(),
  sub_categories: z.array(z.string()).optional(),
  search_value: z.string().optional(),
})

type FilterForm = z.infer<typeof filterFormSchema>

export function FilterFormComponent({
  IdCategory,
  onFilter,
  subCategories,
  searchValue,
}: FilterFormProps) {
  const { watch, setValue } = useForm<FilterForm>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      price_range_min: undefined,
      price_range_max: undefined,
      evaluation_range: undefined,
      discount_range: undefined,
      sort_by_value: false,
      sort_by_evaluation: false,
      id_category: undefined,
      id_sub_category: undefined,
      sub_categories: [],
      search_value: undefined,
    },
  })

  const { mutate: filterForm } = useMutation({
    mutationFn: filterProducts,
    onSuccess: (data) => {
      onFilter?.(data)
    },
  })

  const priceMin = watch('price_range_min')
  const priceMax = watch('price_range_max')
  const evaluation = watch('evaluation_range')
  const discount = watch('discount_range')
  const sortByValue = watch('sort_by_value')
  const sortByEval = watch('sort_by_evaluation')
  const subCategoriesChecked = watch('sub_categories')

  const debouncedFilter = useMemo(
    () =>
      debounce(async (data: FilterForm) => {
        await filterForm(data)
      }),
    [filterForm],
  )

  useEffect(() => {
    debouncedFilter({
      price_range_min: priceMin,
      price_range_max: priceMax,
      evaluation_range: evaluation,
      discount_range: discount,
      sort_by_value: sortByValue,
      sort_by_evaluation: sortByEval,
      id_category: IdCategory,
      sub_categories: subCategoriesChecked,
      search_value: searchValue,
    })
    return () => debouncedFilter.cancel()
  }, [
    priceMin,
    priceMax,
    evaluation,
    discount,
    sortByValue,
    sortByEval,
    debouncedFilter,
    IdCategory,
    subCategoriesChecked,
    searchValue,
  ])

  return (
    <form action="post" className="flex w-1/4 flex-col gap-4">
      <Input
        type="number"
        placeholder="Preço mínimo"
        onChange={(e) =>
          setValue('price_range_min', parseFloat(e.target.value))
        }
      />

      <Input
        type="number"
        placeholder="Preço máximo"
        onChange={(e) =>
          setValue('price_range_max', parseFloat(e.target.value))
        }
      />

      <select
        onChange={(e) =>
          setValue('evaluation_range', parseFloat(e.target.value))
        }
      >
        <option value="">Avaliação a partir de...</option>
        {[...Array(11)].map((_, i) => {
          const val = (i * 0.5).toFixed(1)
          return (
            <option key={val} value={val}>
              {val}
            </option>
          )
        })}
      </select>

      <Input
        type="number"
        placeholder="Desconto %"
        min={0}
        max={100}
        onChange={(e) => setValue('discount_range', parseFloat(e.target.value))}
      />

      <div className="flex flex-col gap-2">
        {subCategories
          ? subCategories.map((subCategory) => {
              const isChecked = subCategoriesChecked?.includes(subCategory.id)

              return (
                <label
                  key={subCategory.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked: boolean) => {
                      const updated = checked
                        ? [...(subCategoriesChecked || []), subCategory.id]
                        : (subCategoriesChecked || []).filter(
                            (id) => id !== subCategory.id,
                          )
                      setValue('sub_categories', updated)
                    }}
                  />
                  <span>{subCategory.sub_category_type}</span>
                </label>
              )
            })
          : null}
      </div>
    </form>
  )
}

export default FilterFormComponent
