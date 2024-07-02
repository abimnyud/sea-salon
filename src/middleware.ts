import { NextResponse, type NextRequest } from 'next/server'
import * as jwt from '@/utils/jwt'
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { JWTExpired } from 'jose/errors';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/reservations')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.rewrite(new URL('/', request.url))
  }

  try {
    /**
     * Verify JWT
     */
    const data = await jwt.verify(token.value, process.env.JWT_SECRET!);
    if (typeof data !== 'object') {
      return NextResponse.rewrite(new URL('/', request.url))
    }


    if (request.nextUrl.pathname.startsWith('/admin') && data.role !== Role.ADMIN) {
      return NextResponse.rewrite(new URL('/', request.url))
    }

    return NextResponse.next();
  } catch (err) {
    console.error(err)
    return NextResponse.rewrite(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}