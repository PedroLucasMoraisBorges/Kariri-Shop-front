import { z } from 'zod'

// const envSchema = z.object({
//   VITE_API_URL: z.string().url(),
//   VITE_ENABLE_API_DELAY: z.string().transform((value) => value === 'true'),
// })

const envSchema = z.object({
  VITE_API_URL: z.preprocess(
    (val) => val ?? 'http://localhost:3000',
    z.string().url(),
  ),
  VITE_ENABLE_API_DELAY: z.preprocess((val) => val === 'true', z.boolean()),
})

export const env = envSchema.parse(import.meta.env)
