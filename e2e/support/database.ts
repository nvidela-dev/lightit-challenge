import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/patient_registration",
    },
  },
});

interface PatientSeedData {
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  documentUrl: string;
}

export const database = {
  async cleanup() {
    await prisma.patient.deleteMany();
  },

  async seed(patients: PatientSeedData[]) {
    return prisma.patient.createMany({ data: patients });
  },

  async count() {
    return prisma.patient.count();
  },

  async findByEmail(email: string) {
    return prisma.patient.findUnique({ where: { email } });
  },

  async disconnect() {
    await prisma.$disconnect();
  },
};
