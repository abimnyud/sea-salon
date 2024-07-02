"use client";

import { Branch } from "@prisma/client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Map } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function BranchCard({ data }: { data: Branch }) {
  const router = useRouter();

  return (
    <Card
      onClick={() =>
        router.push(`/reservations?branchId=${data.id}`, { scroll: false })
      }
      className="hover:bg-slate-50 transition cursor-pointer"
    >
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="font-sans">{data.name}</CardTitle>
        <CardDescription className="font-sans">{data.address}</CardDescription>
      </CardHeader>
      <CardFooter className="text-sm flex justify-between">
        <span>
          {data.openingTime} - {data.closingTime}
        </span>
        <a
          href={`https://www.google.com/maps/place/${data.coordinate}`}
          target="_blank"
          rel="noreferrer noopener"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="inline-flex gap-2 items-center text-crayola">
            <span>Lihat peta</span>
            <Map width={20} height={20} />
          </div>
        </a>
      </CardFooter>
    </Card>
  );
}
