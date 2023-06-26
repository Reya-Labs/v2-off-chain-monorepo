import { Redis } from 'ioredis';
import { getRedisPort, getRedisHost, getEnvironmentV2 } from './envVars';

let redisClient: Redis | null = null;
export const getRedisClient = (): Redis => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(getRedisPort(), getRedisHost());
  return redisClient;
};

export const getNextIndexingBlock = async (
  chainId: number,
): Promise<{
  id: string;
  value: number;
}> => {
  const redisClient = getRedisClient();
  const key = `${getEnvironmentV2()}_next_indexing_block_${chainId}_v2`;
  const value = await redisClient.get(key);

  return {
    id: key,
    value: Number(value || '0'),
  };
};

export const setRedis = async (key: string, value: number): Promise<void> => {
  const redisClient = getRedisClient();
  await redisClient.set(key, value);
};
