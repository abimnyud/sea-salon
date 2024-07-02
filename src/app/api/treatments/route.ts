import { prisma } from '@/lib/prisma'
import { parseQueryUrl } from '@/utils'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const requestQuerySchema = z.object({
  branchId: z.coerce.number().optional()
})

export async function GET(req: Request) {
  const queries = parseQueryUrl<z.infer<typeof requestQuerySchema>>(req.url, requestQuerySchema);

  const data = await prisma.treatment.findMany({
    where: {
      TreatmentOnBranch: {
        some: {
          branchId: queries.branchId
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return NextResponse.json({ success: true, data })
}