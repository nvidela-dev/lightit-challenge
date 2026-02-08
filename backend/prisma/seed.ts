import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const samplePatients = [
  {
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    phoneCode: '+1',
    phoneNumber: '5551234567',
    documentUrl: '/uploads/sample-doc-1.jpg',
  },
  {
    fullName: 'Jane Smith',
    email: 'jane.smith@gmail.com',
    phoneCode: '+44',
    phoneNumber: '7911123456',
    documentUrl: '/uploads/sample-doc-2.jpg',
  },
  {
    fullName: 'Carlos García',
    email: 'carlos.garcia@gmail.com',
    phoneCode: '+34',
    phoneNumber: '612345678',
    documentUrl: '/uploads/sample-doc-3.jpg',
  },
];

const main = () =>
  prisma.patient
    .createMany({ data: samplePatients, skipDuplicates: true })
    .then(({ count }) => console.log(`Seeded ${count} patients`));

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
