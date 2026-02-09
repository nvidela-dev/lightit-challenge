import { useState, useCallback, type ChangeEvent, type FormEvent } from 'react';
import type { ZodSchema, ZodError } from 'zod';

type UseFormOptions<T extends Record<string, unknown>> = {
  initialValues: T;
  schema: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
};

const formatZodErrors = <T extends Record<string, unknown>>(
  error: ZodError<T>
): Partial<Record<keyof T, string>> =>
  error.issues.reduce<Partial<Record<keyof T, string>>>((acc, issue) => {
    const key = issue.path[0];
    if (typeof key === 'string') {
      return { ...acc, [key]: issue.message };
    }
    return acc;
  }, {});

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  schema,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    (data: T): Partial<Record<keyof T, string>> => {
      const result = schema.safeParse(data);
      return result.success ? {} : formatZodErrors(result.error);
    },
    [schema]
  );

  const handleChange = useCallback(
    (field: keyof T) => (e: ChangeEvent<HTMLInputElement>) => {
      const newValues = { ...values, [field]: e.target.value };
      setValues(newValues);
      if (touched) setErrors(validate(newValues));
    },
    [values, touched, validate]
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validate(values);
      setTouched(true);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    },
    [values, validate, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
  };
};
