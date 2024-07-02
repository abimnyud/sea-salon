import qs from 'qs'
import { ZodSchema } from 'zod'

export function parseQueryUrl<T>(url: string, schema: ZodSchema<T>) {
  const parsed = schema.safeParse(qs.parse(url.split('?').pop()!))

  if (parsed.error) {
    throw new Error(parsed.error.message)
  }

  return parsed.data
}