import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { activateUser } from '../api/activate-user'

export function ActivateUser() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    async function validateAndRedirect() {
      try {
        if (!id) {
          toast.error('ID não fornecido.')
          return
        }
        const data = await activateUser(id)
        localStorage.setItem('access_token', data.access_token)

        // Redirecionar para a próxima etapa
        navigate('/createCustomUser')
      } catch (error) {
        toast.error('Falha ao validar o ID. Redirecionando...')
        navigate('/sign-up')
      }
    }

    validateAndRedirect()
  }, [id, navigate])

  return (
    <>
      <Helmet title="Validando..." />
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-muted-foreground">Validando acesso...</p>
      </div>
    </>
  )
}
