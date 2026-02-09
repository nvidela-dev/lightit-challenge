import { request } from '../../api/client';
import type { PatientsResponse, PatientResponse } from './types';

export const fetchPatients = (): Promise<PatientsResponse> =>
  request('/patients');

export const createPatient = (data: FormData): Promise<PatientResponse> =>
  request('/patients', { method: 'POST', body: data });
