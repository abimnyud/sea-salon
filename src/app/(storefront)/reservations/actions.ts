"use server";

import { prisma } from "@/lib/prisma";
import { ReservationForm } from "@/schemas/reservationFormSchema";
import { Branch, Reservation, Role, User } from "@prisma/client";
import { NextResponse } from "next/server";
import * as jwt from "@/utils/jwt";
import { cookies } from "next/headers";
import { format } from "date-fns";

export async function getBranches() {
  return prisma.branch.findMany();
}

export async function getTreatments() {
  return prisma.treatment.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getStylists(params?: { branchId?: number }) {
  return prisma.user.findMany({
    include: {
      branch: true,
    },
    where: {
      role: Role.STYLIST,
      branchId: params?.branchId,
    },
  }) as Promise<Array<User & { branch: Branch }>>;
}

export async function postReservation(formData: ReservationForm) {
  const token = cookies().get("token");

  if (!token) return true;

  try {
    /**
     * Verify JWT
     */
    const payload = await jwt.verify(token.value, process.env.JWT_SECRET!);
    if (typeof payload !== "object") {
      return false;
    }

    const newReservation = await prisma.reservation.create({
      data: {
        branchId: Number(formData.branchId),
        stylistId: formData.stylistId,
        customerId: payload.id,
        treatmentId: Number(formData.treatmentId),
        dateTime: new Date(
          `${format(formData.date, "yyyy-MM-dd")} ${formData.time}`
        ).toISOString(),
        updatedAt: new Date(),
      },
    });

    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
}
