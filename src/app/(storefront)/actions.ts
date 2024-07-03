"use server";

import { prisma } from "@/lib/prisma";
import { signInFormSchema, signUpFormSchema } from "@/schemas/authSchema";
import * as jwt from '@/utils/jwt'
import bcrypt from 'bcrypt'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAvatar } from "@/lib/utils";

export async function signIn(_: any, formData: FormData) {
  const validatedFields = signInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  /**
   * Check on DB
   */
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      role: true,
      password: true,
    },
    where: {
      email: validatedFields.data.email
    }
  })

  if (!user) {
    return {
      success: false,
      toast: {
        title: "Email/password salah",
        description: "Pastikan email dan password yang Anda masukkan sudah benar."
      }
    }
  }

  /**
   * Validate password
   */
  const match = await bcrypt.compare(validatedFields.data.password, user.password);

  if (!match) {
    return {
      success: false,
      toast: {
        title: "Email/password salah",
        description: "Pastikan email dan password yang dimasukkan sudah benar."
      }
    }
  }

  /**
   * Generate JWT Token
   */
  const token = await jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!)

  cookies().set({
    name: "token",
    value: token,
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
  })


  return {
    success: true
  }
}

export async function signUp(_: any, formData: FormData) {
  const validatedFields = signUpFormSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  /**
   * Check on DB
   */
  const user = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email: validatedFields.data.email
    }
  })

  if (user) {
    return {
      success: false,
      toast: {
        title: "Email sudah digunakan",
        description: "Email yang Anda masukkan sudah digunakan pada akun lain."
      }
    }
  }

  /**
   * Hash password
   */
  const saltRounds = 10
  const hashedPassword: string | { error?: Error } = await new Promise((resolve) => bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      resolve({ error: err })
    }

    bcrypt.hash(validatedFields.data.password, salt, function (err, hash) {
      if (err) {
        resolve({ error: err })
      }

      resolve(hash)
    });
  }))

  if (typeof hashedPassword === 'object' && 'error' in hashedPassword) {
    return {
      success: false,
      toast: {
        title: "Terjadi kesalahan",
        description: "Terjadi kesalahan pada sisi server."
      }
    }
  }

  /**
   * Save to DB
   */
  try {
    const newUser = await prisma.user.create({
      data: {
        fullName: validatedFields.data.fullName,
        avatar: getAvatar(),
        email: validatedFields.data.email,
        phoneNumber: validatedFields.data.phoneNumber,
        password: hashedPassword as string,
      }
    })

    /**
     * Generate JWT Token
     */
    const token = await jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET!)

    cookies().set({
      name: "token",
      value: token,
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    })


    return {
      success: true
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      toast: {
        title: "Terjadi kesalahan",
        description: "Terjadi kesalahan pada sisi server."
      }
    }
  }
}

export async function signOut() {
  cookies().delete('token')

  redirect('/')
}

export async function getReviews() {
  return prisma.review.findMany({
    include: {
      customer: true,
      reservation: {
        include: {
          treatment: true,
          branch: true
        }
      }
    },
    orderBy: {
      id: 'desc'
    },
    skip: 0,
    take: 5,
  }).then((data) => data.map((item) => ({ ...item, reservation: { ...item.reservation, treatment: { ...item.reservation.treatment, price: undefined } } })))
}