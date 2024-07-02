import { TreatmentList } from "@/components/treatment/TreatmentList";
import { getBranches, getStylists, getTreatments } from "./actions";
import BranchList from "@/components/branch/BranchList";
import UserReservationDataTable from "@/components/reservations/UserReservationDataTable";
import { StylistList } from "@/components/stylists/StylistList";
import ClientComponent from "./client-component";

export default async function ReservationsPage() {
  const [branchesData, treatmentsData, stylistsData] = await Promise.all([
    getBranches(),
    getTreatments(),
    getStylists(),
  ]);

  return (
    <main className="flex flex-col gap-12 pb-20">
      <section id="branches" className="container flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Pesan berdasarkan cabang</h2>
        <BranchList data={branchesData} />
      </section>
      <section id="stylists" className="container flex flex-col gap-4">
        <h2 className="text-xl font-semibold">
          Pesan berdasarkan penata rambut pilihanmu
        </h2>
        <StylistList data={stylistsData} />
      </section>
      <section id="treatments" className="container flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Pesan berdasarkan layanan</h2>
        <TreatmentList data={treatmentsData} />
      </section>
      <section id="history" className="container flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Riwayat pemesanan</h2>
        <UserReservationDataTable />
      </section>
      <ClientComponent branchesData={branchesData} />
    </main>
  );
}
