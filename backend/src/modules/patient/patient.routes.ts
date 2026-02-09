import { Router } from 'express';
import { upload } from '@/middleware/upload.js';
import { validate, validateWithFile } from '@/middleware/validate.js';
import { getPatientsQuerySchema, createPatientSchema } from './patient.schema.js';
import * as patientController from './patient.controller.js';

const router = Router();

router.get('/', validate(getPatientsQuerySchema, 'query'), patientController.getPatients);
router.post('/', upload.single('document'), validateWithFile(createPatientSchema), patientController.createPatient);

export default router;
