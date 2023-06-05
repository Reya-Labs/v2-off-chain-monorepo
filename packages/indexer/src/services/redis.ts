import { Redis } from 'ioredis';
import { getRedisHost, getRedisPort } from '@voltz-protocol/commons-v2';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(getRedisPort(), getRedisHost());
  return redisClient;
};
