import { prisma } from "@/lib/prisma";
import { parseQueryUrl } from "@/utils";
import { addMinutes, format } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestQuerySchema = z.object({
  branchId: z.coerce.number(),
  stylistId: z.string(),
  date: z.coerce.date()
})

export async function GET(req: Request) {
  const queries = parseQueryUrl(req.url, requestQuerySchema)

  const [reservationData, branchData] = await Promise.all([prisma.reservation.findMany({
    include: {
      treatment: true
    },
    where: {
      branchId: queries.branchId,
      stylistId: queries.stylistId,
      dateTime: {
        gte: new Date(format(queries.date, 'yyyy-MM-dd 00:00')).toISOString(),
        lte: new Date(format(queries.date, 'yyyy-MM-dd 23:59')).toISOString()
      }
    }
  }), prisma.branch.findUnique({ where: { id: queries.branchId } })])


  const openingTime = new Date(`${format(queries.date, 'yyy-MM-dd')} ${branchData?.openingTime}:00`)
  const closingTime = new Date(`${format(queries.date, 'yyy-MM-dd')} ${branchData?.closingTime}:00`)

  const availableSlots = [];
  let currentSlot = openingTime;
  const now = new Date();

  while (currentSlot < closingTime) {
    const slotEnd = new Date(currentSlot.getTime() + 60 * 30000);

    // Check for overlapping reservations
    const conflictingReservation = reservationData.find(reservation => {
      const reservationStart = reservation.dateTime;
      const reservationEnd = new Date(`
        ${format(queries.date, 'yyy-MM-dd')} 
      ${format(addMinutes(reservation.dateTime, reservation.treatment.duration), 'HH:mm')}`);

      return (currentSlot >= reservationStart && currentSlot < reservationEnd) ||
        (slotEnd > reservationStart && slotEnd <= reservationEnd);
    });

    if (!conflictingReservation) {
      const isPassed = now > currentSlot
      availableSlots.push({ start: currentSlot, label: format(currentSlot, 'HH:mm'), available: !isPassed });
    } else {
      availableSlots.push({ start: currentSlot, label: format(currentSlot, 'HH:mm'), available: false });
    }

    currentSlot = slotEnd;
  }

  return NextResponse.json({ success: true, data: availableSlots })
}