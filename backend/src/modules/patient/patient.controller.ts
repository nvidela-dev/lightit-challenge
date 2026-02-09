import type { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs/promises';
import * as patientService from './patient.service.js';
import type { CreatePatientInput, GetPatientsQuery } from './patient.schema.js';

const removeFile = (file?: Express.Multer.File) =>
  file ? unlink(file.path).catch(() => {}) : Promise.resolve();

export const getPatients = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query as unknown as GetPatientsQuery;
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
  const file = req.file!;
  const body = req.body as CreatePatientInput;

  return patientService
    .createPatient(body, `/uploads/${file.filename}`)
    .then((patient) => res.status(201).json({ data: patient }))
    .catch((err) => {
      removeFile(file);
      next(err);
    });
};
