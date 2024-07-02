import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Branch, User } from "@prisma/client";
import StylistCard from "./StylistCard";

export function StylistList({
  data,
}: {
  data: Array<User & { branch: Branch }>;
}) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full overflow-hidden md:overflow-visible"
    >
      <CarouselPrevious />
      <CarouselContent>
        {data.map((stylist) => (
          <StylistCard key={stylist.id} data={stylist} />
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}
