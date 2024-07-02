import { prisma } from "@/lib/prisma"
import { parseQueryUrl } from "@/utils"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

const requestSchema = z.object({
  branchId: z.coerce.number().optional()
})

export async function GET(req: Request) {
  const queries = parseQueryUrl(req.url, requestSchema)

  const data = await prisma.user.findMany({
    where: {
      role: Role.STYLIST,
      branchId: queries.branchId ?? undefined
    }
  })

  return NextResponse.json({ success: true, data })
}