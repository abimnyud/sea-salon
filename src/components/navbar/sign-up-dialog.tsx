"use client";

import { signUp } from "@/app/(storefront)/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { useFormState, useFormStatus } from "react-dom";
import LoadingSpinner from "../ui/loading-spinner";

const initialState: {
  success?: boolean;
  toast?: {
    title: string;
    description: string;
  };
  errors?: any;
} = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      form="signUpForm"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending && <LoadingSpinner />}
      <span className={`${pending ? "invisible" : ""}`}>Daftar</span>
    </Button>
  );
}

export default function SignUpDialog() {
  const [state, formAction] = useFormState(signUp, initialState);
  const { mutate, authenticated } = useAuth();

  if (state?.success === false) {
    toast({
      ...state.toast,
      variant: "destructive",
    });
  }

  if (!authenticated && state?.success === true) {
    mutate();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Daftar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          id="signUpForm"
          action={formAction}
          className="flex flex-col gap-8"
        >
          <DialogHeader>
            <DialogTitle>Daftar</DialogTitle>
            <DialogDescription>
              Masukkan identitas diri Anda untuk mendaftar
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Label htmlFor="fullName">
                Nama<span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nama lengkap Anda"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="email">
                Email<span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email Anda"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="phoneNumber">
                Nomor HP<span className="text-destructive">*</span>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="Nomor HP Anda"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="password">
                Kata Sandi<span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Kata sandi Anda"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
