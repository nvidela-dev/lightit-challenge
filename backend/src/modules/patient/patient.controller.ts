import type { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs/promises';
import * as patientService from './patient.service.js';
import { createPatientSchema, getPatientsQuerySchema } from './patient.schema.js';

const removeFile = (file?: Express.Multer.File) =>
  file ? unlink(file.path).catch(() => {}) : Promise.resolve();

export const getPatients = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = getPatientsQuerySchema.parse(req.query);
  return patientService
    .getPatients(query)
    .then((result) => res.json(result))
    .catch(next);
};

export const createPatient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  if (!file) {
    return next(new Error('File is required'));
  }
  const body = createPatientSchema.parse(req.body);

  return patientService
    .createPatient(body, `/uploads/${file.filename}`)
    .then((patient) => res.status(201).json({ data: patient }))
    .catch((err) => {
      removeFile(file);
      next(err);
    });
};
