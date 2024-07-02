import { Treatment } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Currency } from "@/utils/currency";
import Link from "next/link";

export function TreatmentCardSkeleton() {
  return <Skeleton className="h-20 w-56" />;
}

export function TreatmentCard({ data }: { data: Partial<Treatment> }) {
  return (
    <Link
      href={{
        query: {
          treatmentId: data.id,
        },
      }}
      scroll={false}
    >
      <Card className="flex justify-between flex-col hover:bg-slate-50 transition">
        <CardHeader>
          <CardTitle className="text-sm">{data.name}</CardTitle>
          {/* <CardDescription>{data.description}</CardDescription> */}
        </CardHeader>
        {/* <CardContent></CardContent> */}
        {/* <CardFooter className="flex flex-col items-start">
        <span>{Currency.toRupiah(data.price)}</span>
        <span className="text-sm">
          {data.duration > 60
            ? `${data.duration % 60} jam`
            : `${data.duration} menit`}
        </span>
      </CardFooter> */}
      </Card>
    </Link>
  );
}
