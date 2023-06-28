import * as dotenv from 'dotenv';

dotenv.config();

export const getRedisHost = (): string => {
  return process.env.REDISHOST || 'localhost';
};

export const getRedisPort = (): number => {
  return Number(process.env.REDISPORT) || 6379;
};

export const getEnvironmentV2 = (): string => {
  const key = process.env.ENV_V2;

  if (key) {
    return key;
  }

  throw new Error(`Unspecified v2 Environment Tag.`);
};

export const getAlchemyApiKey = (): string => {
  const key = process.env.ALCHEMY_API_KEY;

  if (key) {
    return key;
  }

  throw new Error(`Unspecified Alchemy API key.`);
};

export const getInfuraApiKey = (): string => {
  const key = process.env.INFURA_API_KEY;

  if (key) {
    return key;
  }

  throw new Error(`Unspecified Infura API key.`);
};
