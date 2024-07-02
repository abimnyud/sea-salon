import { Branch } from "@prisma/client";
import BranchCard from "./BranchCard";

export default function BranchList({ data }: { data?: Array<Branch> }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {data?.map((item) => {
        return <BranchCard key={item.id} data={item} />;
      })}
    </div>
  );
}
