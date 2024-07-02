import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jwt from '@/utils/jwt'
import { prisma } from "@/lib/prisma";

export async function GET() {
  const token = cookies().get('token');

  if (!token) return NextResponse.json({ success: false });

  try {
    /**
     * Verify JWT
     */
    const data = await jwt.verify(token.value, process.env.JWT_SECRET!);
    if (typeof data !== 'object') {
      return NextResponse.json({ success: false });
    }

    /**
     * Find user data
     */
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        fullName: true,
        avatar: true,
        email: true,
        role: true,
        phoneNumber: true,
        password: false
      }, where: { id: data.id }
    })

    if (!user) return NextResponse.json({ success: false });

    return NextResponse.json({ success: true, data: user })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false })
  }
}