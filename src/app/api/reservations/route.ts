import { prisma } from "@/lib/prisma";
import { parseQueryUrl } from "@/utils";
import { ReservationStatus } from "@prisma/client";
import * as jwt from '@/utils/jwt'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { format } from "date-fns";

const requestQuerySchema = z.object({
  filters: z.object({
    reservationStatus: z.nativeEnum(ReservationStatus).optional(),
    branchId: z.coerce.number().optional(),
    date: z.object({
      from: z.coerce.date(),
      to: z.coerce.date()
    }).optional(),
  }).optional(),
  pagination: z.object({
    skip: z.coerce.number().optional(),
    take: z.coerce.number().optional()
  }).optional()
})

export async function GET(req: Request) {
  const token = cookies().get('token');

  if (!token) return NextResponse.json({ success: false });

  try {
    /**
     * Verify JWT
     */
    const parsedJwt = await jwt.verify(token.value, process.env.JWT_SECRET!);
    if (typeof parsedJwt !== 'object') {
      return NextResponse.json({ success: false });
    }

    console.log(req.url)
    const queries = parseQueryUrl<z.infer<typeof requestQuerySchema>>(req.url, requestQuerySchema);
    const data = await prisma.reservation.findMany({
      include: {
        treatment: true,
        branch: true,
        stylist: true
      },
      where: {
        customerId: parsedJwt.id,
        reservationStatus: queries.filters?.reservationStatus,
        branchId: queries.filters?.branchId,
        dateTime: {
          gte: queries.filters?.date?.from ? new Date(format(queries.filters?.date?.from, 'yyyy-MM-dd 00:00')).toISOString() : undefined,
          lte: queries.filters?.date?.to ? new Date(format(queries.filters?.date?.to, 'yyyy-MM-dd 23:59')).toISOString() : undefined
        }
      },
      skip: queries.pagination?.skip ?? 0,
      take: queries.pagination?.take ?? 10,
      orderBy: {
        id: 'desc'
      }
    })

    return NextResponse.json({ success: true, data })
  }
  catch (e) {
    console.error(e)
    return NextResponse.json({ success: false })
  }
}