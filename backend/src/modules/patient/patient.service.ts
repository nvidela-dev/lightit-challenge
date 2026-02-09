import { prisma } from '@config/database.js';
import { ConflictError } from '@shared/errors.js';
import { dispatchConfirmationEmail } from '@services/notification/notification.queue.js';
import type { CreatePatientInput } from './patient.schema.js';

const patientSelect = {
  id: true,
  fullName: true,
  email: true,
  phoneCode: true,
  phoneNumber: true,
  documentUrl: true,
  createdAt: true,
} as const;

const formatPatient = ({ createdAt, ...rest }: { createdAt: Date; [key: string]: unknown }) => ({
  ...rest,
  createdAt: createdAt.toISOString(),
});

type PaginationParams = {
  page: number;
  limit: number;
};

export const getPatients = async ({ page, limit }: PaginationParams) => {
  const skip = (page - 1) * limit;

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      select: patientSelect,
      orderBy: { fullName: 'asc' },
      skip,
      take: limit,
    }),
    prisma.patient.count(),
  ]);

  return {
    data: patients.map(formatPatient),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const ensureEmailNotTaken = (email: string) =>
  prisma.patient
    .findUnique({ where: { email }, select: { id: true } })
    .then((existing) =>
      existing
        ? Promise.reject(new ConflictError('email', 'A patient with this email already exists'))
        : Promise.resolve()
    );

export const createPatient = (input: CreatePatientInput, documentUrl: string) =>
  ensureEmailNotTaken(input.email)
    .then(() => prisma.patient.create({ data: { ...input, documentUrl }, select: patientSelect }))
    .then((patient) => {
      dispatchConfirmationEmail({
        patientId: patient.id,
        email: patient.email,
        fullName: patient.fullName,
      });
      return formatPatient(patient);
    });
