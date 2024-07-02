import { fakerID_ID as faker } from "@faker-js/faker"
import { Treatment } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export const dummyTreatments: Array<Partial<Treatment>> = [...new Array(10).keys()].map((val) => (
  {
    id: val,
    image: faker.image.url(),
    name: faker.lorem.word(),
    description: faker.lorem.paragraph({ min: 1, max: 2 }),
    price: new Decimal(20000),
    duration: faker.number.int({ min: 1, max: 3 })
  }
))