"use client";

import { Treatment } from "@prisma/client";
import { TreatmentCard, TreatmentCardSkeleton } from "./TreatmentCard";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";

export function TreatmentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-8">
      {[...new Array(count).keys()].map((val) => {
        return <TreatmentCardSkeleton key={val} />;
      })}
    </div>
  );
}

export function TreatmentList({ data }: { data: Array<Partial<Treatment>> }) {
  const treatments = data;
  const [showCount, setShowCount] = useState(9);

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
      {treatments.slice(0, showCount).map((item) => {
        return <TreatmentCard key={item.id} data={item} />;
      })}
      <Card
        className="bg-salmon/10 text-salmon border-salmon cursor-pointer hover:bg-salmon/20 transition"
        onClick={() => setShowCount((prev) => (prev === 9 ? 36 : 9))}
      >
        <CardHeader>
          <CardTitle className=" text-sm inline-flex items-center gap-2">
            {showCount === 9 ? (
              <>
                Lihat lebih banyak
                <span>
                  <CircleChevronRight height={20} width={20} />
                </span>
              </>
            ) : (
              <>
                Lihat lebih sedikit
                <span>
                  <CircleChevronLeft />
                </span>
              </>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
