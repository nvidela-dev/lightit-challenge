import { createQueue } from '@config/queue.js';
import type { NotificationJob } from './types.js';

export const notificationQueue = createQueue<NotificationJob>('notifications');

export const dispatchConfirmationEmail = (payload: {
  patientId: string;
  email: string;
  fullName: string;
}) =>
  notificationQueue.add('SEND_CONFIRMATION_EMAIL', {
    type: 'SEND_CONFIRMATION_EMAIL',
    payload,
  });
