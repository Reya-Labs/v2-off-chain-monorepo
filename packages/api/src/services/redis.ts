import { getRedisHost, getRedisPort } from '@voltz-protocol/commons-v2';
import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(getRedisPort(), getRedisHost());
  return redisClient;
};
