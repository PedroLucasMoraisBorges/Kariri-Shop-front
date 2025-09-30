import { useMutation } from '@tanstack/react-query'
import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProfile } from '@/pages/api/get-profile'
import { signIn } from '@/pages/api/sign-in'

const signInForm = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>({
    defaultValues: {
      email: searchParams.get('email') || '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignInForm) {
    try {
      const responsedData = await authenticate({
        email: data.email,
        password: data.password,
        rememberMe,
      })

      if (rememberMe) {
        localStorage.setItem('access_token', responsedData.access_token)
      } else {
        sessionStorage.setItem('access_token', responsedData.access_token)
      }

      const userProfile = await getProfile()

      if (userProfile == null || userProfile.is_company === false) {
        // Se o usuário não for proprietário, redirecione para a página de quadras
        navigate('/dashboard-client')
      } else {
        // Caso contrário, redirecione para a página inicial
        navigate('/dashboard-company')
      }
    } catch {
      toast.error('E-mail ou Senha invalidos.')
    }
  }
  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold">
              <ShoppingBag />
              <span className="text-orange-400">Kariri</span>
              Shop
            </h1>
            <p>Bem vindo de volta, faça o seu login</p>
          </div>
          <div className="flex justify-around rounded-md bg-slate-200 dark:text-black">
            <Button asChild className="m-2 w-40">
              <Link to="/sign-in">Login</Link>
            </Button>
            <Button asChild variant={'ghost'} className="m-2 w-40">
              <Link to="/sign-up">Cadastro</Link>
            </Button>
          </div>
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register('email')}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#" /** Adicionar a paga para redefinir senha */
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register('password')}
                />
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />

                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lembrar de mim
                  </label>
                </div>
              </div>
              <Button
                disabled={isSubmitting}
                type="submit"
                variant="karirishop"
                className="w-full text-white"
              >
                {isSubmitting ? 'Carregando...' : 'Login'}
              </Button>
              {/* <div className="text-center text-sm">
                <span className="relative z-10 px-2 text-muted-foreground">
                  Ou continue com Google
                </span>
              </div>
              <Button
                disabled={isSubmitting}
                variant="karirishop"
                className="w-full text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Login com o Google
              </Button> */}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
