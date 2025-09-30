export interface ApiError {
  response?: {
    data?: {
      message?: string | string[]
      error?: string
      statusCode?: number
    }
  }
}

export function handleApiErrors(
  error: ApiError,
): { errors: string[]; error?: string; statusCode?: number } | undefined {
  if (error.response && error.response.data) {
    const { message, error: errorDetail, statusCode } = error.response.data
    let errors: string[] = []

    if (Array.isArray(message)) {
      errors = [...new Set(message)] // Remove duplicados
    } else if (typeof message === 'string') {
      errors = [message]
    }

    return { errors, error: errorDetail, statusCode }
  } else {
    console.error('Erro desconhecido:', error)
  }
  return undefined
}
