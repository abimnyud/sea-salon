"use client";

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
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "@/app/(storefront)/actions";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
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
      form="signInForm"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending && <LoadingSpinner />}
      <span className={`${pending ? "invisible" : ""}`}>Masuk</span>
    </Button>
  );
}

export default function SignInDialog() {
  const [state, formAction] = useFormState(signIn, initialState);
  const { authenticated, mutate } = useAuth();

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
        <Button variant="ghost" className="hover:bg-salmon/20">
          Masuk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          id="signInForm"
          className="flex flex-col gap-8"
          action={formAction}
        >
          <DialogHeader>
            <DialogTitle>Masuk</DialogTitle>
            <DialogDescription>
              Masuk menggunakan akun Anda yang telah terdaftar
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email Anda"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                name="password"
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
