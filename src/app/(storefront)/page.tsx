import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getReviews } from "./actions";
import { ClientComponent } from "./client-component";

export default async function Home() {
  const reviews = await getReviews();

  return (
    <main>
      <section id="treatments" className="container px-0 flex items-center">
        <div className="relative  w-[36rem]">
          <Image
            src={"/images/hero.png"}
            height={500}
            width={500}
            alt="Woman with flowers"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="flex flex-col font-bold text-cetacean text-6xl font-sora">
            <span>Beauty &</span>
            <span>Elegance Redefined</span>
          </h1>
          <Button
            asChild
            className="group bg-cetacean text-seashell w-fit justify-start flex hover:scale-x-110 origin-left transition hover:bg-cetacean/80 rounded-full"
          >
            <Link href="/reservations" className="flex gap-4">
              <span className=" transition-none">Reservasi Sekarang </span>
              <MoveRight className="group-hover:translate-x-1 transition" />
            </Link>
          </Button>
        </div>
      </section>
      {reviews && reviews.length > 0 && (
        <section
          id="reviews"
          className="flex flex-col gap-8 justify-center items-center w-full container py-24"
        >
          <h2 className="font-sora text-3xl font-semibold">Testimoni</h2>
          <ClientComponent reviewsData={reviews} />
        </section>
      )}
    </main>
  );
}
