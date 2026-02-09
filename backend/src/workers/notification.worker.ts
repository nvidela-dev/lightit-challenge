import 'dotenv/config';
import { createWorker } from '@config/queue.js';
import {
  sendConfirmationEmail,
  sendConfirmationSms,
} from '@services/notification/channels/index.js';
import type { NotificationJob, JobPayload } from '@services/notification/types.js';

const jobHandlers: {
  [K in NotificationJob['type']]: (payload: JobPayload<K>) => Promise<unknown>;
} = {
  SEND_CONFIRMATION_EMAIL: ({ email, fullName }) =>
    sendConfirmationEmail(email, fullName),
  SEND_CONFIRMATION_SMS: ({ phoneCode, phoneNumber, fullName }) =>
    sendConfirmationSms(phoneCode, phoneNumber, fullName),
};

const processJob = async ({ data }: { data: NotificationJob }) => {
  console.log(`Processing job: ${data.type}`);
  const handler = jobHandlers[data.type] as (
    payload: NotificationJob['payload']
  ) => Promise<unknown>;
  await handler(data.payload);
  console.log(`Job completed: ${data.type}`);
};

const worker = createWorker<NotificationJob>('notifications', processJob);

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

console.log('Notification worker started');
