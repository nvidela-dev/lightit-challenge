import { useState, useCallback } from 'react';
import { FormField } from '../../../components/FormField';
import { PhoneInput } from '../../../components/PhoneInput';
import { FileDropzone } from '../../../components/FileDropzone';
import { Button } from '../../../components/Button';
import { useForm } from '../../../hooks/useForm';
import { createPatientSchema, type CreatePatientFormValues } from '../schemas';

type PatientFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting?: boolean;
};

const initialValues: CreatePatientFormValues = {
  fullName: '',
  email: '',
  phoneCode: '+1',
  phoneNumber: '',
};

export const PatientForm = ({ onSubmit, isSubmitting = false }: PatientFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();

  const handleFormSubmit = useCallback(
    async (values: CreatePatientFormValues) => {
      if (!file) {
        setFileError('Document photo is required');
        return;
      }
      setFileError(undefined);

      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('email', values.email);
      formData.append('phoneCode', values.phoneCode);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('document', file);

      await onSubmit(formData);
    },
    [file, onSubmit]
  );

  const { values, errors, touched, handleChange, handleSubmit } = useForm({
    initialValues,
    schema: createPatientSchema,
    onSubmit: handleFormSubmit,
  });

  const handleFileChange = useCallback((newFile: File | null) => {
    setFile(newFile);
    if (newFile) setFileError(undefined);
  }, []);

  const showFileError = touched && !file ? fileError : undefined;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField label="Full Name" error={errors.fullName}>
        <input
          type="text"
          value={values.fullName}
          onChange={handleChange('fullName')}
          placeholder="John Doe"
        />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <input
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          placeholder="john.doe@gmail.com"
        />
      </FormField>

      <PhoneInput
        codeValue={values.phoneCode}
        numberValue={values.phoneNumber}
        onCodeChange={handleChange('phoneCode')}
        onNumberChange={handleChange('phoneNumber')}
        error={errors.phoneCode || errors.phoneNumber}
      />

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-medium text-slate-900">Document Photo</legend>
        <FileDropzone value={file} onChange={handleFileChange} error={showFileError} />
      </fieldset>

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        Register Patient
      </Button>
    </form>
  );
};
