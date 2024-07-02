"use client";

import { addDays, format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Branch, Treatment, User } from "@prisma/client";
import {
  usePrefetchQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CalendarIcon, MoveRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form";
import { Currency } from "@/utils/currency";
import { postReservation } from "./actions";
import { ReservationForm } from "@/schemas/reservationFormSchema";

export default function ClientComponent({
  branchesData: initialBranchesData,
}: {
  branchesData: Array<Branch>;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const methods = useForm<ReservationForm>();
  const onSubmit: SubmitHandler<ReservationForm> = async (data) => {
    await postReservation(data).then(async (res) => {
      if (res) {
        console.log("masuk");
        await queryClient
          .refetchQueries({
            queryKey: ["reservationData"],
            type: "active",
          })
          .then(() => {
            onClose();
          });
      }
    });
  };
  const router = useRouter();
  const branchId = useMemo(
    () =>
      searchParams.has("branchId")
        ? Number(searchParams.get("branchId"))
        : undefined,
    [searchParams]
  );
  const stylistId = useMemo(
    () => searchParams.get("stylistId"),
    [searchParams]
  );
  const { isLoading: stylistsLoading, data: stylistsData } = useQuery({
    queryKey: ["stylists", branchId],
    queryFn: async () =>
      (
        await fetch(`/api/stylists?branchId=${branchId}`).then((response) =>
          response.json()
        )
      ).data as Promise<Array<User & { branch: Branch }>>,
    enabled: !!branchId,
  });
  const { isLoading: treatmentsLoading, data: treatmentsData } = useQuery({
    queryKey: ["treatments", branchId],
    queryFn: async () =>
      (
        await fetch(`/api/treatments?branchId=${branchId}`).then((response) =>
          response.json()
        )
      ).data as Promise<Array<Treatment>>,
    enabled: !!branchId,
  });
  const { isLoading: timeSlotsLoading, data: timeSlotsData } = useQuery({
    queryKey: ["timeSlots", branchId, stylistId, methods.getValues("date")],
    queryFn: async () =>
      (
        await fetch(
          `/api/reservations/time-slots?branchId=${branchId}&stylistId=${stylistId}&date=${format(
            methods.getValues("date"),
            "yyyy-MM-dd"
          )}`
        ).then((response) => response.json())
      ).data,
    enabled: !!branchId || !!stylistId || !!methods.watch("date"),
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      searchParams.has("treatmentId") ||
      searchParams.has("branchId") ||
      searchParams.has("stylistId")
    ) {
      if (searchParams.has("branchId") && !methods.getValues("branchId")) {
        methods.setValue("branchId", Number(searchParams.get("branchId")));
      }

      if (
        searchParams.has("treatmentId") &&
        !methods.getValues("treatmentId")
      ) {
        methods.setValue(
          "treatmentId",
          Number(searchParams.get("treatmentId"))
        );
      }

      if (searchParams.has("stylistId") && !methods.getValues("stylistId")) {
        methods.setValue("stylistId", searchParams.get("stylistId") as string);
      }

      !open && setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function onClose() {
    // Remove search params
    router.replace("/reservations", { scroll: false });

    // Clear form
    methods.reset();

    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="w-full md:min-w-[48rem] h-[calc(100dvh)]">
        <form
          className="flex flex-col justify-between h-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <SheetHeader className="pb-4">
            <SheetTitle>Reservasi</SheetTitle>
            <SheetDescription>
              Detail reservasi layanan SEA Salon
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <div className="flex-grow flex gap-6 flex-col justify-start overflow-y-scroll px-1 pt-4 pb-8">
            <section id="branch" className="flex flex-col gap-2">
              <h3 className="font-sora font-medium">Pilih lokasi</h3>
              <ul className="grid grid-cols-1 gap-4">
                {initialBranchesData.map((branch) => (
                  <li key={branch.id} className="relative">
                    <label htmlFor="branchId">
                      <input
                        type="radio"
                        value={branch.id}
                        className="absolute z-50 w-full h-full flex items-center justify-center cursor-pointer opacity-0"
                        {...methods.register("branchId")}
                        onClick={() =>
                          router.push(
                            `${pathname}?branchId=${branch.id.toString()}`,
                            { scroll: false }
                          )
                        }
                      />
                      <Card
                        className={`${
                          methods.watch("branchId") == branch.id
                            ? "bg-slate-100"
                            : ""
                        }`}
                      >
                        <CardHeader className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <CardTitle className="text-md">
                              {branch.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              <span>{branch.address}</span>
                            </CardDescription>
                          </div>
                          <span className="font-medium">
                            {branch.openingTime} - {branch.closingTime}
                          </span>
                        </CardHeader>
                      </Card>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
            <section id="stylists" className="flex flex-col gap-2">
              <h3 className="font-sora font-medium">Pilih Stylist</h3>
              {stylistsLoading ? (
                <div>Loading...</div>
              ) : (
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                  {stylistsData?.map((stylist) => {
                    return (
                      <li key={stylist.id}>
                        <Button
                          variant="ghost"
                          className={`h-full w-full relative py-8
                                flex items-center justify-center  ${
                                  stylistId == stylist.id
                                    ? "bg-slate-100 outline-slate-300 outline"
                                    : ""
                                }`}
                        >
                          <label htmlFor="stylistId">
                            <input
                              type="radio"
                              value={stylist.id}
                              className="absolute inset-0 w-full z-50 h-full flex items-center justify-center cursor-pointer opacity-0"
                              {...methods.register("stylistId")}
                              onClick={() =>
                                router.push(
                                  pathname +
                                    "?" +
                                    createQueryString("stylistId", stylist.id),
                                  { scroll: false }
                                )
                              }
                            />
                            <div className="flex flex-col items-center gap-4">
                              <Avatar className="h-24 w-24">
                                <AvatarImage
                                  src={stylist.avatar}
                                  alt={stylist.fullName}
                                />
                                <AvatarFallback>
                                  {stylist.fullName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>{stylist.fullName}</span>
                            </div>
                          </label>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
            {treatmentsData && branchId && (
              <section id="treatments" className="flex flex-col gap-2">
                <h3 className="font-sora font-medium">Pilih layanan</h3>
                <ul className="grid grid-cols-2 gap-4">
                  {treatmentsData?.map((treatment) => (
                    <li key={treatment.id}>
                      <label htmlFor="treatmentId" className="relative">
                        <input
                          type="radio"
                          value={treatment.id}
                          className="absolute z-50 w-full h-full flex items-center justify-center cursor-pointer opacity-0"
                          {...methods.register("treatmentId")}
                          onClick={() =>
                            router.push(
                              `${pathname}?${createQueryString(
                                "treatmentId",
                                treatment.id.toString()
                              )}`,
                              { scroll: false }
                            )
                          }
                        />
                        <Card
                          className={`${
                            methods.watch("treatmentId") == treatment.id
                              ? "bg-slate-100"
                              : ""
                          }`}
                        >
                          <CardHeader>
                            <CardTitle className="text-xl">
                              {treatment.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {treatment.description}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex items-center justify-between">
                            <span className="font-medium">
                              {Currency.toRupiah(
                                treatment.price as unknown as number
                              )}
                            </span>
                            <span className="text-sm">
                              {treatment.duration > 60
                                ? treatment.duration === 60
                                  ? "1 jam"
                                  : `${Math.floor(treatment.duration / 60)} jam`
                                : `${treatment.duration} menit`}
                            </span>
                          </CardFooter>
                        </Card>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {stylistsData && (
              <section id="date" className="flex flex-col gap-2">
                <h3 className="font-sora font-medium">
                  Pilih tanggal reservasi
                </h3>
                <FormField
                  control={methods.control}
                  name="date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !methods.watch("date") && "text-muted-foreground"
                          )}
                        >
                          {methods.watch("date") ? (
                            format(methods.watch("date"), "PPP", {
                              locale: id,
                            })
                          ) : (
                            <span>Pilih tanggal reservasi</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < addDays(new Date(), -1) ||
                            date > addDays(new Date(), 14)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </section>
            )}
            {timeSlotsData && (
              <section id="date" className="flex flex-col gap-2">
                <h3 className="font-sora font-medium">
                  Pilih waktu yang tersedia
                </h3>
                <ul className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {timeSlotsData?.map(
                    (timeSlot: {
                      start: Date;
                      label: string;
                      available: boolean;
                    }) => {
                      return (
                        <li key={timeSlot.label}>
                          <Button
                            variant="outline"
                            type="button"
                            disabled={!timeSlot.available}
                            className={`relative ${
                              methods.watch("time") === timeSlot.label
                                ? "bg-slate-200"
                                : ""
                            } `}
                            onClick={() => {
                              if (
                                methods.getValues("time") === timeSlot.label
                              ) {
                                methods.resetField("time");
                              } else {
                                methods.setValue("time", timeSlot.label);
                              }
                            }}
                          >
                            <span>{timeSlot.label}</span>
                          </Button>
                        </li>
                      );
                    }
                  )}
                </ul>
              </section>
            )}
          </div>
          <SheetFooter className="pt-4 w-full">
            <Button
              type="submit"
              className="group w-full inline-flex gap-2 items-center"
            >
              <span>Reservasi</span>
              <MoveRight className="group-hover:translate-x-4 transition" />
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
