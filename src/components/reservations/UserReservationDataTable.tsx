"use client";

import { Reservation, ReservationStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import qs from "qs";
import { useMemo, useState } from "react";
import { z } from "zod";
import { DataTable } from "../ui/data-table";
import { Card, CardContent, CardHeader } from "../ui/card";
import LoadingSpinner from "../ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePickerRange } from "../ui/date-pricker-range";
import { format } from "date-fns";
import { Currency } from "@/utils/currency";
import { Badge } from "../ui/badge";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "id",
    header: "Nomor Reservasi",
  },
  {
    accessorKey: "branch.name",
    header: "Cabang",
  },
  {
    accessorKey: "treatment.name",
    header: "Layanan",
  },
  {
    accessorKey: "stylist.fullName",
    header: "Penata Rambut",
  },
  {
    accessorKey: "treatment.price",
    header: "Harga",
    cell: (cell) => Currency.toRupiah(cell.getValue() as number),
  },
  {
    accessorKey: "dateTime",
    header: "Tanggal",
    cell: (cell) => format(cell.getValue() as Date, "eeee, d MMM yyyy HH:mm"),
  },
  {
    accessorKey: "reservationStatus",
    header: "Status",
    cell: (cell) => {
      switch (cell.getValue() as ReservationStatus) {
        case "PENDING":
          return <Badge variant="secondary">Menunggu Konfirmasi</Badge>;
        case "CONFIRMED":
          return (
            <Badge className="bg-green-200 text-green-950 hover:bg-green-600 hover:text-green-100">
              Terkonfirmasi
            </Badge>
          );
        case "CANCELLED":
          return <Badge variant="destructive">Dibatalkan</Badge>;
        case "DONE":
          return (
            <Badge className="bg-blue-200 text-blue-900 hover:bg-blue-600 hover:text-blue-100">
              Selesai
            </Badge>
          );
      }
    },
  },
];

const dataTableQueriesSchema = z.object({
  filters: z.object({
    reservationStatus: z.string().optional(),
    branchId: z.coerce.number().optional(),
  }),
  pagination: z
    .object({
      skip: z.coerce.number().optional(),
      take: z.coerce.number().optional(),
    })
    .optional(),
});

export default function UserReservationDataTable() {
  const [queries, setQueries] = useState<
    z.infer<typeof dataTableQueriesSchema>
  >({
    filters: {},
    pagination: {
      skip: 0,
      take: 10,
    },
  });
  const [date, setDate] = useState<DateRange | undefined>();
  const formattedDate = useMemo(() => {
    if (!date?.to || !date.from) {
      return undefined;
    }

    return {
      from: format(date?.from as Date, "yyyy-MM-dd"),
      to: format(date?.to as Date, "yyyy-MM-dd"),
    };
  }, [date?.from, date?.to]);
  const query = useMemo(
    () =>
      qs.stringify({
        ...queries,
        filters: { ...queries.filters, date: formattedDate },
      }),
    [queries, formattedDate]
  );
  const { isLoading, data, isRefetching } = useQuery({
    queryKey: ["reservationData", query],
    queryFn: async () =>
      (
        await fetch(`/api/reservations${query ? `?${query}` : ""}`).then(
          (response) => response.json()
        )
      ).data,
  });

  if (isLoading && !isRefetching) {
    return (
      <Card className="pt-6 h-[16.12rem]">
        <CardContent className="w-full h-full flex justify-center items-center">
          <LoadingSpinner className="text-cetacean" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <Select
            onValueChange={(value) =>
              setQueries((prev) => ({
                ...prev,
                filters: { ...prev.filters, reservationStatus: value },
              }))
            }
          >
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder="Status Reservasi" />
            </SelectTrigger>
            <SelectContent className="font-sans">
              <SelectItem value={ReservationStatus.PENDING}>
                Menunggu Konfirmasi
              </SelectItem>
              <SelectItem value={ReservationStatus.CANCELLED}>
                Dibatalkan
              </SelectItem>
              <SelectItem value={ReservationStatus.CONFIRMED}>
                Terkonfirmasi
              </SelectItem>
              <SelectItem value={ReservationStatus.DONE}>Selesai</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerRange date={date} setDate={setDate} />
        </div>
      </CardHeader>
      <CardContent>
        {isRefetching ? (
          <div className="h-36 flex justify-center items-center">
            <LoadingSpinner className="text-cetacean" />
          </div>
        ) : (
          <DataTable columns={columns} data={data} className="border-0" />
        )}
      </CardContent>
    </Card>
  );
}
