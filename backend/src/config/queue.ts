import { Queue, Worker, type ConnectionOptions } from 'bullmq';
import { env } from './env.js';

const parseRedisUrl = (url: string): ConnectionOptions => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '6379', 10),
    ...(parsed.password && { password: parsed.password }),
  };
};

const redisConnection = parseRedisUrl(env.REDIS_URL);

export const createQueue = <T>(name: string) =>
  new Queue<T>(name, { connection: redisConnection });

export const createWorker = <T>(
  name: string,
  processor: (job: { data: T }) => Promise<void>
) =>
  new Worker<T>(name, processor, {
    connection: redisConnection,
    concurrency: 5,
  });
