import type { Request } from 'express';

export interface TypedRequest<T> extends Request {
  body: T;
}

export interface PatientCreateInput {
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
}

export interface PatientResponse {
  id: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  documentUrl: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error?: string;
  errors?: Record<string, string>;
}
