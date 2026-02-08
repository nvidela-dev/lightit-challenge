import 'dotenv/config';
import { createWorker } from '../config/queue.js';
import { sendConfirmationEmail } from '../services/notification/channels/email.channel.js';
import type { NotificationJob } from '../services/notification/types.js';

const jobHandlers: Record<
  NotificationJob['type'],
  (payload: NotificationJob['payload']) => Promise<unknown>
> = {
  SEND_CONFIRMATION_EMAIL: ({ email, fullName }) =>
    sendConfirmationEmail(email, fullName),
};

const processJob = async ({ data }: { data: NotificationJob }) => {
  console.log(`Processing job: ${data.type}`);
  const handler = jobHandlers[data.type];
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
