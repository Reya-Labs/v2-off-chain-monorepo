import * as dotenv from 'dotenv';

dotenv.config();

export const getRedisHost = (): string => {
  return process.env.REDISHOST || 'localhost';
};

export const getRedisPort = (): number => {
  return Number(process.env.REDISPORT) || 6379;
};

export const getEnvironmentV1 = (): string => {
  return (process.env.ENVV1 || 'staging').toUpperCase();
};

export const getEnvironmentV2 = (): string => {
  return (process.env.ENVV2 || 'staging').toUpperCase();
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

export const getApiPort = (): number => {
  const port = process.env.PORT;

  return Number(port || '8080');
};
