import { request } from '../../api/client';
import type { PatientsResponse, PatientResponse } from './types';

type FetchPatientsParams = {
  page?: number;
  limit?: number;
};

export const fetchPatients = ({ page = 1, limit = 6 }: FetchPatientsParams = {}): Promise<PatientsResponse> =>
  request(`/patients?page=${page}&limit=${limit}`);

export const createPatient = (data: FormData): Promise<PatientResponse> =>
  request('/patients', { method: 'POST', body: data });
