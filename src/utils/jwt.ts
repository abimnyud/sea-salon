import { Role } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

const tokenPayloadSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(Role)
})
type TokenPayload = z.infer<typeof tokenPayloadSchema>

async function sign(payload: TokenPayload, secret: string): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; // one hour

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

async function verify(token: string, secret: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify<TokenPayload>(token, new TextEncoder().encode(secret));
  // run some checks on the returned payload, perhaps you expect some specific values

  // if its all good, return it, or perhaps just return a boolean
  return payload;
}

export {
  sign, verify, tokenPayloadSchema
}