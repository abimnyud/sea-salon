import { Decimal } from "@prisma/client/runtime/library";

export class Currency {
  static toRupiah(num: number) {

    return new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 2, style: "currency", currency: "IDR" }).format(
      num,
    )
  }
}