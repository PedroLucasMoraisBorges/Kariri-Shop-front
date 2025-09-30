// import { useMutation } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { ShoppingBag } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeRegister } from '@/pages/api/complete-company-register'

const companyForm = z.object({
  name_company: z.string(),
  description: z.string(),
  business_niche: z.string(),
})

type CompanyForm = z.infer<typeof companyForm>

export function CompleteCompanyRegister() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CompanyForm>()

  const { mutateAsync: registerCompanyData } = useMutation({
    mutationFn: completeRegister,
  })

  async function handleSignUp(data: CompanyForm) {
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    try {
      const response = await registerCompanyData(data)

      if (response?.url) {
        toast.success('Informações cadastradas com sucesso!')
        navigate(response.url)
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
          <form
            method="post"
            onSubmit={handleSubmit(handleSignUp)}
            className="space-y-4"
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Nome da Empresa</Label>
                <Input
                  id="name_company"
                  type="text"
                  placeholder="Nome da empresa"
                  required
                  {...register('name_company')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  placeholder="Dê uma breve descrição de sua empresa"
                  required
                  className="min-h-[100px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('description')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business_niche">Nicho</Label>
                <select
                  id="business_niche"
                  required
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('business_niche')}
                >
                  <option value="">Selecione um nicho</option>
                  <option value="Maquiagem e Cosméticos">
                    Maquiagem e Cosméticos
                  </option>
                  <option value="Moda e Acessórios">Moda e Acessórios</option>
                  <option value="Peças de Carro e Acessórios Automotivos">
                    Peças de Carro e Acessórios Automotivos
                  </option>
                  <option value="Eletrônicos e Tecnologia">
                    Eletrônicos e Tecnologia
                  </option>
                  <option value="Casa e Decoração">Casa e Decoração</option>
                  <option value="Saúde e Bem-Estar">Saúde e Bem-Estar</option>
                  <option value="Alimentos e Bebidas">
                    Alimentos e Bebidas
                  </option>
                  <option value="Esportes e Lazer">Esportes e Lazer</option>
                  <option value="Livros e Papelaria">Livros e Papelaria</option>
                  <option value="Jogos e Brinquedos">Jogos e Brinquedos</option>
                </select>
              </div>
              <Button
                disabled={isSubmitting}
                type="submit"
                variant="karirishop"
                className="w-full text-white"
              >
                Salvar
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
