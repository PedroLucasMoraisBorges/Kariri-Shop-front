import { useMutation } from '@tanstack/react-query'
import { ShoppingBag } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCompany } from '@/pages/api/create-company'
import { getCepInfo } from '@/pages/api/get-cep'

function formatCpfCnpj(value: string): string {
  const numeric = value.replace(/\D/g, '')

  if (numeric.length <= 11) {
    return numeric
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    return numeric
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }
}

function detectCpfOrCnpj(value: string): 'cpf' | 'cnpj' {
  const numeric = value.replace(/\D/g, '')
  return numeric.length <= 11 ? 'cpf' : 'cnpj'
}

const companyForm = z
  .object({
    cpf: z.string(),
    cnpj: z.string(),
    road: z.string(),
    cep: z.string(),
    number: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
  })
  .refine((data) => data.cpf || data.cnpj, {
    message: 'CPF ou CNPJ é obrigatório',
    path: ['cpf'],
  })

type RegisterCompanyForm = z.infer<typeof companyForm>

export function CreateCompany() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterCompanyForm>()

  const cep = watch('cep')
  const document = watch('cpf') || watch('cnpj') || ''

  const { mutateAsync: registerCompany } = useMutation({
    mutationFn: createCompany,
  })

  async function handleRegister(data: RegisterCompanyForm) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    try {
      const response = await registerCompany({
        cpf: data.cpf.replace(/\D/g, ''),
        cnpj: data.cnpj.replace(/\D/g, ''),
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
        navigate('/completeCompanyRegister')
      }
    } catch {
      toast.error('Erro ao realizar o cadastro.')
    }
  }
  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold">
              <ShoppingBag />
              <span className="text-orange-400">Kariri</span>
              Shop
            </h1>
            <p>Quase lá, só mais algumas informações.</p>
          </div>
          <div className="flex justify-around rounded-md bg-slate-200 dark:text-black">
            <Button asChild variant={'ghost'} className="m-2 w-40">
              <Link to="/createCustomUser">Cliente</Link>
            </Button>
            <Button asChild className="m-2 w-40">
              <Link to="/createCompany">Empresa</Link>
            </Button>
          </div>
          <form
            method="post"
            onSubmit={handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="document">CPF ou CNPJ</Label>
              <Input
                id="document"
                type="text"
                placeholder="Digite CPF ou CNPJ"
                value={document}
                onChange={(e) => {
                  const formatted = formatCpfCnpj(e.target.value)
                  const type = detectCpfOrCnpj(e.target.value)

                  setValue('cpf', type === 'cpf' ? formatted : '')
                  setValue('cnpj', type === 'cnpj' ? formatted : '')
                }}
                maxLength={18}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                type="text"
                placeholder="00000-000"
                required
                {...register('cep')}
                value={cep || ''}
                onChange={async (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 8)
                  const formatted = value.replace(/^(\d{5})(\d)/, '$1-$2')
                  setValue('cep', formatted)

                  if (value.length === 8) {
                    try {
                      const address = await getCepInfo(value)
                      setValue('road', address.road)
                      setValue('neighborhood', address.neighborhood)
                      setValue('city', address.city)
                      setValue('state', address.state)
                    } catch {
                      toast.error('CEP inválido ou não encontrado.')
                    }
                  }
                }}
                maxLength={9}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="road">Rua</Label>
              <Input
                id="road"
                type="text"
                placeholder="Rua teste..."
                required
                {...register('road')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="number">N°</Label>
              <Input
                id="number"
                type="number"
                placeholder="010"
                required
                {...register('number')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                type="text"
                placeholder="Bairro"
                required
                {...register('neighborhood')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                type="text"
                placeholder="Cidade"
                required
                disabled
                {...register('city')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                type="text"
                placeholder="Estado"
                required
                disabled
                {...register('state')}
              />
            </div>
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="karirishop"
              className="w-full text-white"
            >
              Finalizar Cadastro
            </Button>
            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos{' '}
              <a className="underline underline-offset-4" href="#">
                termos de serviços
              </a>{' '}
              e{' '}
              <a className="underline underline-offset-4" href="#">
                poíticas de privacidade
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
