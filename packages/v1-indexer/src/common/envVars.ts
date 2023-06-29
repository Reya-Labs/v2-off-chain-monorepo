import * as dotenv from 'dotenv';

dotenv.config();

export const getRedisHost = (): string => {
  return process.env.REDISHOST || 'localhost';
};

export const getRedisPort = (): number => {
  return Number(process.env.REDISPORT) || 6379;
};

export const getEnvironmentV1 = (): string => {
  const key = process.env.ENV_V1;

  if (key) {
    return key;
  }

  throw new Error(`Unspecified v1 Environment Tag.`);
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

export const getCoingeckoApiKey = (): string => {
  const key = process.env.COINGECKO_API_KEY;

  if (key) {
    return key;
  }

  throw new Error(`Unspecified Coingecko API key.`);
};
