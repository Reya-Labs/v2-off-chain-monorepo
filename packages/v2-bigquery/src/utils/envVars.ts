import * as dotenv from 'dotenv';

dotenv.config();

export const getEnvironmentV2 = (): string => {
  return (process.env.ENV_V2 || 'staging').toUpperCase();
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
