import type { Request, Response, NextFunction } from 'express';
import * as patientService from './patient.service.js';
import { createPatientSchema, getPatientsQuerySchema } from './patient.schema.js';
import { removeFile } from '@shared/file.js';
import { ValidationError } from '@shared/errors.js';

export const getPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = getPatientsQuerySchema.parse(req.query);
    const result = await patientService.getPatients(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  if (!file) {
    return next(new ValidationError({ document: 'Document photo is required' }));
  }

  try {
    const body = createPatientSchema.parse(req.body);
    const patient = await patientService.createPatient(body, `/uploads/${file.filename}`);
    res.status(201).json({ data: patient });
  } catch (err) {
    removeFile(file);
    next(err);
  }
};
