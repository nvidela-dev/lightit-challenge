import type { Request, Response, NextFunction } from 'express';
import * as patientService from './patient.service.js';
import { ValidationError } from '@shared/errors.js';
import { formatZodErrors } from '@shared/validation.js';
import { createPatientSchema } from './patient.schema.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 18;

export const getPatients = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Math.max(1, Number(req.query.page) || DEFAULT_PAGE);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || DEFAULT_LIMIT));

  return patientService
    .getPatients({ page, limit })
    .then((result) => res.json(result))
    .catch(next);
};

export const createPatient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  const result = createPatientSchema.safeParse(req.body);

  const validationErrors = {
    ...(!file && { document: 'Document photo is required' }),
    ...(!result.success && formatZodErrors(result.error?.issues ?? [])),
  };

  return Object.keys(validationErrors).length
    ? next(new ValidationError(validationErrors))
    : patientService
        .createPatient(result.data!, `/uploads/${file!.filename}`)
        .then((patient) => res.status(201).json({ data: patient }))
        .catch(next);
};
