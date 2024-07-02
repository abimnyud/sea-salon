import { fakerID_ID as faker } from "@faker-js/faker"
import { Branch } from "@prisma/client"

export const branches: Array<Partial<Branch>> = [...new Array(5).keys()].map((val) => ({
  id: val,
  name: faker.company.buzzAdjective(),
  address: faker.location.streetAddress(),
  coordinate: faker.location.nearbyGPSCoordinate({ origin: [-6.3644023397283025, 106.82899205768472] }).join(', ')
}))