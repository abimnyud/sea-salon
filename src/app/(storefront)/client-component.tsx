"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef } from "react";
import { Branch, Reservation, Review, Treatment, User } from "@prisma/client";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function ClientComponent({
  reviewsData,
}: {
  reviewsData: Array<
    Review & {
      customer: User;
      reservation: Reservation & {
        treatment: Partial<Treatment>;
        branch: Branch;
      };
    }
  >;
}) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-lg"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselPrevious />

      <CarouselContent>
        {reviewsData.map((review, index) => (
          <CarouselItem key={index}>
            <div className="flex flex-col p-1 items-center gap-5">
              <p className="text-lg text-center">{review.comment}</p>
              <div className="flex items-center text-sm gap-4">
                <Avatar>
                  <AvatarImage
                    src={review.customer.avatar}
                    alt={review.customer.fullName}
                  />
                  <AvatarFallback>{review.customer.fullName[0]}</AvatarFallback>
                </Avatar>
                <span>{review.customer.fullName}</span>
              </div>
              <div className="inline-flex gap-3 text-sm text-ce">
                <span>{review.reservation.branch.name}</span> <span>•</span>
                <span>{review.reservation.treatment.name}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}
