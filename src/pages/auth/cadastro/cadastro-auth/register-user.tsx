// import { useMutation } from '@tanstack/react-query'
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
import { createCustomUser } from '@/pages/api/create-custom-user'
import { getCepInfo } from '@/pages/api/get-cep'

function formatCpf(value: string) {
  return value
    .replace(/\D/g, '') // Remove tudo que não for número
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatCep(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2') // Aplica a máscara 00000-000
    .slice(0, 9) // Limita o tamanho final a 9 caracteres
}

const customUserForm = z.object({
  birthday: z.date(),
  cpf: z.string(),
  road: z.string(),
  cep: z.string(),
  number: z.number(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
})

type CustomUserForm = z.infer<typeof customUserForm>

export function CreateCustomUser() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<CustomUserForm>()

  const cpf = watch('cpf')
  const cep = watch('cep')

  const { mutateAsync: registerCustomUser } = useMutation({
    mutationFn: createCustomUser,
  })

  async function handleRegister(data: CustomUserForm) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    try {
      const response = await registerCustomUser({
        birthday: data.birthday,
        cpf: data.cpf.replace(/\D/g, ''),
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
        navigate('/dashboard-client')
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
            <p>Olá, seja bem-vindo! Cadastre-se e conecte-se!</p>
          </div>
          <div className="flex justify-around rounded-md bg-slate-200 dark:text-black">
            <Button asChild className="m-2 w-40">
              <Link to="/createCustomUser">Cliente</Link>
            </Button>
            <Button asChild variant={'ghost'} className="m-2 w-40">
              <Link to="/createCompany">Empresa</Link>
            </Button>
          </div>
          <form
            method="post"
            onSubmit={handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="birthDay">Data de Nascimento</Label>
                <Input
                  id="birthDay"
                  type="date"
                  required
                  {...register('birthday')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="084.450.323-13"
                  required
                  {...register('cpf')}
                  onChange={(e) => {
                    const formatted = formatCpf(e.target.value)
                    setValue('cpf', formatted)
                  }}
                  value={cpf || ''}
                  maxLength={14}
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
                  type="text"
                  placeholder="010"
                  required
                  {...register('number')}
                  maxLength={5}
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
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
