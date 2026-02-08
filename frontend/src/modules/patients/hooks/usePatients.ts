import { useQuery } from '@tanstack/react-query';
import { fetchPatients } from '../api';

export const usePatients = () =>
  useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });
