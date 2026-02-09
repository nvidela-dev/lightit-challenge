export type Patient = {
  id: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  documentUrl: string;
  createdAt: string;
};

export type PatientsResponse = {
  data: Patient[];
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
