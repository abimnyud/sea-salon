import validator from "validator";
import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export type SignInForm = z.infer<typeof signInFormSchema>

export const signUpFormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().refine(validator.isMobilePhone),
  password: z.string(),
});
export type SignUpForm = z.infer<typeof signUpFormSchema>