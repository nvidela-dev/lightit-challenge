import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPatients, createPatient } from '../api';

export const usePatients = () =>
  useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
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
