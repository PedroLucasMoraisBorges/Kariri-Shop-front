import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { validateCartCheckoutSession } from '../api/validate-cart-checkout-success'

export function ValidateCartCheckoutSession() {
  const hasRun = useRef(false)
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function validateAndRedirect() {
      if (!sessionId) {
        toast.error('ID não fornecido.')
        return
      }

      try {
        await validateCartCheckoutSession(sessionId)
        navigate('/dashboard-client')
      } catch (error) {
        toast.error('Falha ao validar o ID. Redirecionando...')
        navigate('/dashboard-client')
      }
    }

    validateAndRedirect()
  }, [sessionId, navigate])

  return (
    <>
      <Helmet title="Validando..." />
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-muted-foreground">
          Validando pagamento...
        </p>
      </div>
    </>
  )
}
