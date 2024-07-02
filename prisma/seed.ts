import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import { fakerID_ID as faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  /**
   * Admin and User
   */
  await prisma.user.upsert({
    where: { email: 'admin@abimanyu.dev' },
    update: {},
    create: {
      email: 'admin@abimanyu.dev',
      fullName: 'Super Admin',
      avatar: getAvatar(),
      phoneNumber: '081234567891',
      password: bcrypt.hashSync('password', 10),
      role: Role.ADMIN
    },
  })
  await prisma.user.upsert({
    where: { email: 'demo@abimanyu.dev' },
    update: {},
    create: {
      email: 'demo@abimanyu.dev',
      fullName: 'Demo User',
      avatar: getAvatar(),
      phoneNumber: '081234567891',
      password: bcrypt.hashSync('password', 10),
      role: Role.CUSTOMER
    },
  })


  /**
   * Branches
   */
  await prisma.branch.createMany({
    data: [
      {
        name: 'SEA Salon Bogor',
        coordinate: '-6.370285699340954,106.82704989014356',
        address: 'Jl. Walet No.13, RT.02/RW.06, Tanah Sareal, Kec. Tanah Sareal, Kota Bogor, Jawa Barat 16161',
        openingTime: faker.helpers.arrayElement(['08:00', '09:00', '10:00']),
        closingTime: faker.helpers.arrayElement(['20:00', '21:00', '22:00']),
      },
      {
        name: 'SEA Salon Depok',
        coordinate: '-6.370285699340954,106.82704989014356',
        address: 'Jl. Lingkar, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424',
        openingTime: faker.helpers.arrayElement(['08:00', '09:00', '10:00']),
        closingTime: faker.helpers.arrayElement(['20:00', '21:00', '22:00']),
      },
      {
        name: 'SEA Salon Jakarta',
        coordinate: '-6.370285699340954,106.82704989014356',
        address: 'Jl. Jend Gatot Subroto Ged Manggala Wanabakti 1, Dki Jakarta',
        openingTime: faker.helpers.arrayElement(['08:00', '09:00', '10:00']),
        closingTime: faker.helpers.arrayElement(['20:00', '21:00', '22:00']),
      }
    ]
  })

  /**
   * Treatments
   */
  await prisma.treatment.createMany({
    data: [
      {
        name: 'Hair Cut',
        image: '/images/svg/hair-cut.svg',
        description: 'Potong rambut sesuai dengan gaya yang diinginkan.',
        price: 105000,
        duration: 30,
      },
      {
        name: "Wash & Blow Dry",
        image: '/images/svg/hair-cut.svg',
        description: "Cuci rambut dan keringkan dengan menggunakan hair dryer.",
        price: 30000,
        duration: 45
      },
      {
        name: "Blow In/Catok",
        image: '/images/svg/hair-cut.svg',
        description: "Keringkan rambut dan di-catok untuk tampilan yang halus.",
        price: 50000,
        duration: 45
      },
      {
        name: "Wash & Blow In/Catok",
        image: '/images/svg/hair-cut.svg',
        description: "Cuci rambut, keringkan dan di-catok untuk tampilan yang halus.",
        price: 75000,
        duration: 60
      },
      {
        name: "Hair/Bangs Trimming",
        image: '/images/svg/hair-cut.svg',
        description: "Potong poni atau ujung rambut untuk tampilan yang segar.",
        price: 50000,
        duration: 15
      },
      {
        name: "Hair Do",
        image: '/images/svg/hair-cut.svg',
        description: "Penataan rambut untuk acara khusus atau gaya tertentu.",
        price: 150000,
        duration: 60
      },
      {
        name: "Creambath",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan intensif dengan krim untuk merawat rambut.",
        price: 75000,
        duration: 60
      },
      {
        name: "Hair Mask Texture",
        image: '/images/svg/hair-cut.svg',
        description: "Masker rambut untuk meningkatkan tekstur dan kondisi rambut.",
        price: 85000,
        duration: 30
      },
      {
        name: "Hair Spa Loreal",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan rambut dengan produk Loreal untuk kelembutan dan kilau.",
        price: 85000,
        duration: 60
      },
      {
        name: "Hair Spa Shiseido",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan rambut dengan produk Shiseido untuk kehalusan dan kelembutan.",
        price: 100000,
        duration: 60
      },
      {
        name: "Scalp Treatment",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan kulit kepala untuk kesehatan dan stimulasi rambut.",
        price: 150000,
        duration: 45
      },
      {
        name: "Scrub Ketombe",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan untuk mengatasi ketombe dan menjaga kulit kepala sehat.",
        price: 70000,
        duration: 30
      },
      {
        name: "Foot Massage",
        image: '/images/svg/hair-cut.svg',
        description: "Pijatan untuk relaksasi dan perawatan kaki.",
        price: 50000,
        duration: 30
      },
      {
        name: "Back Massage",
        image: '/images/svg/hair-cut.svg',
        description: "Pijatan untuk relaksasi dan perawatan punggung.",
        price: 50000,
        duration: 30
      },
      {
        name: "Hair Coloring Basic",
        image: '/images/svg/hair-cut.svg',
        description: "Pewarnaan rambut standar untuk mengubah warna rambut.",
        price: 300000,
        duration: 120
      },
      {
        name: "Balayage No Bleach",
        image: '/images/svg/hair-cut.svg',
        description: "Teknik pewarnaan tanpa bleach untuk efek highlight alami model balayage.",
        price: 600000,
        duration: 180
      },
      {
        name: "Highlight No Bleach",
        image: '/images/svg/hair-cut.svg',
        description: "Teknik pewarnaan tanpa bleach untuk highlight rambut.",
        price: 600000,
        duration: 150
      },
      {
        name: "Bleaching Balayage",
        image: '/images/svg/hair-cut.svg',
        description: "Pewarnaan rambut dengan teknik balayage menggunakan bleach.",
        price: 400000,
        duration: 180
      },
      {
        name: "Bleaching Peek a Boo",
        image: '/images/svg/hair-cut.svg',
        description: "Pewarnaan rambut dengan highlight sembunyi balik lapisan rambut menggunakan bleach.",
        price: 400000,
        duration: 150
      },
      {
        name: "Bleaching Highlight",
        image: '/images/svg/hair-cut.svg',
        description: "Pewarnaan rambut dengan highlight menggunakan bleach.",
        price: 400000,
        duration: 150
      },
      {
        name: "Bleaching Full Head",
        image: '/images/svg/hair-cut.svg',
        description: "Pewarnaan rambut secara menyeluruh menggunakan bleach.",
        price: 500000,
        duration: 180
      },
      {
        name: "Keratin Infuse",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan untuk menghaluskan dan meremajakan rambut dengan keratin.",
        price: 400000,
        duration: 90
      },
      {
        name: "Keratin Smoothing",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan lanjutan untuk meratakan rambut dengan keratin.",
        price: 800000,
        duration: 120
      },
      {
        name: "Keratin Therapy",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan mendalam untuk meremajakan dan meratakan rambut dengan keratin.",
        price: 800000,
        duration: 180
      },
      {
        name: "Traditional Perm",
        image: '/images/svg/hair-cut.svg',
        description: "Teknik permanent wave tradisional untuk gaya rambut ikal.",
        price: 500000,
        duration: 120
      },
      {
        name: "Blow Perm/Korean Wave",
        image: '/images/svg/hair-cut.svg',
        description: "Teknik permanent wave dengan hasil yang halus dan natural.",
        price: 1150000,
        duration: 120
      },
      {
        name: "Classic Manicure",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan dasar untuk kuku tangan.",
        price: 65000,
        duration: 45
      },
      {
        name: "Russian Manicure",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan lanjutan untuk kuku tangan dengan hasil yang halus.",
        price: 80000,
        duration: 60
      },
      {
        name: "Pedicure",
        image: '/images/svg/hair-cut.svg',
        description: "Perawatan untuk kaki, termasuk perawatan kuku dan pijatan.",
        price: 75000,
        duration: 60
      },
      {
        name: "Nail Gel",
        image: '/images/svg/hair-cut.svg',
        description: "Aplikasi gel untuk kuku tangan.",
        price: 90000,
        duration: 60
      },
      {
        name: "Nail Gel Halal",
        image: '/images/svg/hair-cut.svg',
        description: "Aplikasi gel yang menggunakan produk halal untuk kuku tangan.",
        price: 125000,
        duration: 60
      },
      {
        name: "Nail Extension + Gel",
        image: '/images/svg/hair-cut.svg',
        description: "Aplikasi perpanjangan kuku dengan menggunakan gel.",
        price: 200000,
        duration: 120
      },
      {
        name: "Remove Gel",
        image: '/images/svg/hair-cut.svg',
        description: "Penghapusan gel dari kuku tangan.",
        price: 35000,
        duration: 30
      },
      {
        name: "Remove Gel Extension",
        image: '/images/svg/hair-cut.svg',
        description: "Penghapusan gel extension dari kuku tangan.",
        price: 50000,
        duration: 45
      }

    ]
  })

  /**
   * Treatments on Branch
   */
  await prisma.treatmentOnBranch.createMany({
    data: [...new Array(100).keys()].map((val) => ({
      treatmentId: faker.number.int({ min: 1, max: 36 }),
      branchId: faker.number.int({ min: 1, max: 3 })
    })),
    skipDuplicates: true
  })

  /**
   * Stylist
   */
  await prisma.user.createMany({
    data: [...new Array(12).keys()].map((val) => ({
      email: `stylist${val}@abimanyu.dev`,
      fullName: faker.person.fullName(),
      avatar: getAvatar(),
      phoneNumber: '081234567891',
      password: bcrypt.hashSync('password', 10),
      role: Role.STYLIST,
      branchId: faker.number.int({ min: 1, max: 3 })
    }))
  })

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

export function getAvatar() {

  const listOfNames = [
    "Mary Baker",
    "Amelia Earhart",
    "Mary Roebling",
    "Sarah Winnemucca",
    "Margaret Brent",
    "Lucy Stone",
    "Mary Edwards",
    "Margaret Chase",
    "Mahalia Jackson",
    "Maya Angelou",
    "Margaret Bourke",
    "Eunice Kennedy",
    "Carrie Chapman",
    "Elizabeth Peratrovich",
    "Alicia Dickerson",
    "Daisy Gatson",
    "Emma Willard",
    "Amelia Boynton",
    "Maria Mitchell",
    "Sojourner Truth",
    "Willa Cather",
    "Coretta Scott",
    "Harriet Tubman",
    "Fabiola Cabeza",
    "Sacagawea",
    "Esther Martinez",
    "Elizabeth Cady",
    "Bessie Coleman",
    "Ma Rainey",
    "Julia Ward",
    "Irene Morgan",
    "Babe Didrikson",
    "Lyda Conley",
    "Annie Dodge",
    "Maud Nathan",
    "Betty Ford",
    "Rosa Parks",
    "Susan La",
    "Gertrude Stein",
    "Wilma Mankiller",
    "Grace Hopper",
    "Jane Addams",
    "Katharine Graham",
    "Florence Chadwick",
    "Zora Neale",
    "Wilma Rudolph",
    "Annie Jump",
    "Mother Frances",
    "Jovita Idár",
    "Maggie L",
    "Henrietta Swan",
    "Jane Cunningham",
    "Victoria Woodhull",
    "Helen Keller",
    "Patsy Takemoto",
    "Chien-Shiung",
    "Dorothea Dix",
    "Margaret Sanger",
    "Alice Paul",
    "Frances Willard",
    "Sally Ride",
    "Juliette Gordon",
    "Queen Lili",
    "Katharine Lee",
    "Harriet Beecher",
    "Felisa Rincon",
    "Hetty Green",
    "Belva Lockwood",
    "Biddy Mason",
    "Ida B",
    "Eleanor Roosevelt",
    "Maria Goeppert",
    "Phillis Wheatley",
    "Mary Harris",
    "Fannie Lou",
    "Rosalyn Yalow",
    "Susan B",
    "Clara Barton",
    "Lady Deborah",
    "Jane Johnston",
    "Alice Childress",
    "Georgia O",
    "Rebecca Crumpler",
    "Anne Bradstreet",
    "Elizabeth Blackwell",
    "Christa McAuliffe",
    "Edmonia Lewis",
    "Nellie Bly",
    "Mary Cassatt",
    "Pauli Murray",
    "Ellen Swallow",
    "Hedy Lamarr",
    "Pearl Kendrick",
    "Abigail Adams",
    "Margaret Fuller",
    "Emma Lazarus",
    "Marian Anderson",
    "Virginia Apgar",
    "Mary Walton",
  ];
  return `https://source.boringavatars.com/beam/120/${encodeURI(
    listOfNames[Math.floor(Math.random() * listOfNames.length + 1)]
  )}?colors=32DE84,E9C681,EFE898,91C09E,7D7769`;
}
