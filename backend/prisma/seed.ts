import { PrismaClient } from '@prisma/client';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott',
];

const phoneCodes = ['+1', '+44', '+34', '+49', '+33', '+39', '+81', '+86', '+91'];

const generatePatients = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const avatarIndex = (i % 9) + 1;

    return {
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 0 ? i : ''}@email.com`,
      phoneCode: phoneCodes[i % phoneCodes.length],
      phoneNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`.slice(0, 10),
      documentUrl: `/uploads/avatar-${avatarIndex}.jpg`,
    };
  });

const copyAvatars = () => {
  const seedImagesDir = join(__dirname, 'seed-images');
  const uploadsDir = join(__dirname, '..', 'public', 'uploads');

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  for (let i = 1; i <= 9; i += 1) {
    const src = join(seedImagesDir, `avatar-${i}.jpg`);
    const dest = join(uploadsDir, `avatar-${i}.jpg`);
    if (existsSync(src)) {
      copyFileSync(src, dest);
    }
  }
  console.log('Copied 9 avatar images to uploads folder');
};

const main = async () => {
  copyAvatars();

  await prisma.patient.deleteMany();
  console.log('Cleared existing patients');

  const patients = generatePatients(36);
  const { count } = await prisma.patient.createMany({ data: patients });
  console.log(`Seeded ${count} patients`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
