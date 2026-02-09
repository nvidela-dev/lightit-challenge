import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPatients, createPatient } from '../api';

type UsePatientsParams = {
  page?: number;
  limit?: number;
};

export const usePatients = ({ page = 1, limit = 6 }: UsePatientsParams = {}) =>
  useQuery({
    queryKey: ['patients', { page, limit }],
    queryFn: () => fetchPatients({ page, limit }),
  });

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
