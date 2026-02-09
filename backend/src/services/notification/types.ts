// Channel enum (mirrors Prisma enum for use in application code)
export const NotificationChannel = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
} as const;

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

// Base payload shared across channels
type BaseNotificationPayload = {
  patientId: string;
  fullName: string;
};

// Channel-specific payloads
type EmailPayload = BaseNotificationPayload & {
  email: string;
};

type SmsPayload = BaseNotificationPayload & {
  phoneCode: string;
  phoneNumber: string;
};

// Job type definitions
export type ConfirmationEmailJob = {
  type: 'SEND_CONFIRMATION_EMAIL';
  payload: EmailPayload;
};

export type ConfirmationSmsJob = {
  type: 'SEND_CONFIRMATION_SMS';
  payload: SmsPayload;
};

// Union of all notification jobs
export type NotificationJob = ConfirmationEmailJob | ConfirmationSmsJob;

// Utility type for extracting payload by job type
export type JobPayload<T extends NotificationJob['type']> = Extract<
  NotificationJob,
  { type: T }
>['payload'];
