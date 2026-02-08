import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import * as patientController from './patient.controller.js';

const router = Router();

router.get('/', patientController.getPatients);
router.post('/', upload.single('document'), patientController.createPatient);

export default router;
