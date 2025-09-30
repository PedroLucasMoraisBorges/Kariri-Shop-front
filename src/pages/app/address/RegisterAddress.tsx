import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAddress } from '@/pages/api/address-module'
import { getCepInfo } from '@/pages/api/get-cep'

function formatCep(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2') // Aplica a máscara 00000-000
    .slice(0, 9) // Limita o tamanho final a 9 caracteres
}

const addressForm = z.object({
  road: z.string(),
  cep: z.string(),
  number: z.number(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
})

type AddressForm = z.infer<typeof addressForm>

export function RegisterAddress() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<AddressForm>()

  const cep = watch('cep')

  const { mutateAsync: createAddressForm } = useMutation({
    mutationFn: createAddress,
  })

  async function handleRegister(data: AddressForm) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    try {
      const response = await createAddressForm({
        cep: data.cep.replace(/\D/g, ''),
        road: data.road,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      })

      if (response?.errors) {
        response.errors.forEach((error: string) => {
          toast.error(error)
        })
      } else {
        toast.success('Informações cadastradas com sucesso!')
        navigate(-1)
      }
    } catch {
      toast.error('Erro ao realizar o cadastro.')
    }
  }

  return (
    <>
      <Helmet title="Cadastrar Endereço" />
      <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-2/4 flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">Adicionar Endereço</h1>
          <div className="flex flex-col gap-6 px-3 lg:flex-row">
            <form
              method="post"
              onSubmit={handleSubmit(handleRegister)}
              className="flex w-full flex-col gap-10"
            >
              <div className="grid gap-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  type="text"
                  placeholder="00000-000"
                  required
                  {...register('cep')}
                  onChange={async (e) => {
                    const formatted = formatCep(e.target.value)
                    setValue('cep', formatted)

                    const numericCep = formatted.replace(/\D/g, '')
                    if (numericCep.length === 8) {
                      try {
                        const data = await getCepInfo(numericCep)
                        setValue('road', data.road)
                        setValue('neighborhood', data.neighborhood)
                        setValue('city', data.city)
                        setValue('state', data.state)
                      } catch {
                        toast.error('Erro ao buscar o CEP.')
                      }
                    }
                  }}
                  value={cep || ''}
                  maxLength={9}
                />
              </div>
              <div className="flex gap-2">
                <div className="grid w-3/4 gap-2">
                  <Label htmlFor="road">Rua</Label>
                  <Input
                    id="road"
                    type="string"
                    required
                    {...register('road')}
                  />
                </div>
                <div className="grid w-1/4 gap-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    type="number"
                    required
                    {...register('number')}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  type="string"
                  required
                  {...register('neighborhood')}
                />
              </div>

              <div className="flex gap-2">
                <div className="grid w-2/4 gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    type="string"
                    required
                    {...register('city')}
                  />
                </div>
                <div className="grid w-2/4 gap-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    type="string"
                    required
                    {...register('state')}
                  />
                </div>
              </div>
              <div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="mt-3 w-fit rounded-lg bg-blue-400 p-2 font-bold text-white"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterAddress
