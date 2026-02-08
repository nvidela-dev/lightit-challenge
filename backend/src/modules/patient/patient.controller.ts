import type { Request, Response, NextFunction } from 'express';
import * as patientService from './patient.service.js';
import { ValidationError } from '@shared/errors.js';
import { formatZodErrors } from '@shared/validation.js';
import { createPatientSchema } from './patient.schema.js';

export const getPatients = (
  _req: Request,
  res: Response,
  next: NextFunction
) =>
  patientService
    .getAllPatients()
    .then((patients) => res.json({ data: patients }))
    .catch(next);

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
