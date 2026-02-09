import { createQueue } from '@config/queue.js';
import type { NotificationJob, NotificationChannel } from './types.js';

export const notificationQueue = createQueue<NotificationJob>('notifications');

// Low-level dispatchers for specific channels
export const dispatchConfirmationEmail = (payload: {
  patientId: string;
  email: string;
  fullName: string;
}) =>
  notificationQueue.add('SEND_CONFIRMATION_EMAIL', {
    type: 'SEND_CONFIRMATION_EMAIL',
    payload,
  });

export const dispatchConfirmationSms = (payload: {
  patientId: string;
  phoneCode: string;
  phoneNumber: string;
  fullName: string;
}) =>
  notificationQueue.add('SEND_CONFIRMATION_SMS', {
    type: 'SEND_CONFIRMATION_SMS',
    payload,
  });

// High-level dispatcher that routes based on patient preference
type ConfirmationPayload = {
  patientId: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  notificationPreference: NotificationChannel;
};

export const dispatchConfirmation = (payload: ConfirmationPayload) => {
  switch (payload.notificationPreference) {
    case 'EMAIL':
      return dispatchConfirmationEmail({
        patientId: payload.patientId,
        email: payload.email,
        fullName: payload.fullName,
      });
    case 'SMS':
      return dispatchConfirmationSms({
        patientId: payload.patientId,
        phoneCode: payload.phoneCode,
        phoneNumber: payload.phoneNumber,
        fullName: payload.fullName,
      });
    default: {
      const _exhaustive: never = payload.notificationPreference;
      throw new Error(`Unknown notification preference: ${_exhaustive}`);
    }
  }
};
