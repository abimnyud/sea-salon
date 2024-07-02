import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CarouselItem } from "../ui/carousel";
import { Branch, User } from "@prisma/client";

export default function StylistCard({
  data,
}: {
  data: User & { branch: Branch };
}) {
  return (
    <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/6">
      <Link
        href={{
          query: {
            branchId: data.branchId,
            stylistId: data.id,
          },
        }}
        scroll={false}
      >
        <div className="rounded-xl flex hover:bg-salmon/10 transition flex-col items-center gap-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage alt={data.fullName} src={data.avatar} />
            <AvatarFallback>{data.fullName[0]}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">{data.fullName}</h3>
          <span className="text-sm">{data.branch.name}</span>
        </div>
      </Link>
    </CarouselItem>
  );
}
