import { Redis } from 'ioredis';
import { getRedisHost, getRedisPort } from './envVars';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(getRedisPort(), getRedisHost());
  return redisClient;
};
