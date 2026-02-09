export type Patient = {
  id: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  documentUrl: string;
  createdAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PatientsResponse = {
  data: Patient[];
  pagination: Pagination;
};

export type PatientResponse = {
  data: Patient;
};

export type CreatePatientInput = {
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
};
