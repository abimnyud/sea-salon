"use client";

import { useAuth } from "@/providers/auth-provider";
import SignInDialog from "./sign-in-dialog";
import SignUpDialog from "./sign-up-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(storefront)/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { loading, authenticated, user, mutate } = useAuth();
  const pathname = usePathname();

  return (
    <div className="w-full fixed z-50 h-24 flex items-center bg-seashell/60 backdrop-blur">
      <div className="flex gap-12 items-center container">
        <Link href={"/"}>
          <h1 className="text-2xl md:text-3xl font-extrabold font-sora md:pb-1">
            <span className="text-cetacean">sea</span>
            <span className="text-crayola">salon</span>
          </h1>
        </Link>
        {loading ? (
          <div className="flex gap-4 items-center flex-grow justify-between">
            <div className="flex gap-5">
              <Skeleton className="bg-salmon/30 h-5 w-14" />
              <Skeleton className="bg-salmon/30 h-5 w-16" />
            </div>
            <Skeleton className="h-10 w-10 bg-salmon/30 rounded-full" />
          </div>
        ) : (
          <div className="flex justify-between flex-grow items-center font-sans">
            <div className="flex items-center gap-6 [&>*]:text-sm hover:[&>*]:text-slate-900 [&>*]:transition">
              <Link
                href="/"
                className={`${
                  pathname === "/" ? "text-slate-900" : "text-slate-500"
                } hidden md:inline-block`}
              >
                Beranda
              </Link>
              {authenticated && (
                <Link
                  href="/reservations"
                  className={`${
                    pathname === "/reservations"
                      ? "text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  Reservasi
                </Link>
              )}
            </div>
            <div className="flex gap-4 items-center">
              {authenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt="@shadcn" />
                      <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-4">
                    <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        className="font-normal text-destructive w-full justify-start hover:cursor-pointer"
                        onClick={() =>
                          signOut().then(() => {
                            mutate();
                          })
                        }
                      >
                        Keluar
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <SignInDialog />
                  <SignUpDialog />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
