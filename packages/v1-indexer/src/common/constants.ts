import * as dotenv from 'dotenv';

dotenv.config();

export const SECONDS_IN_YEAR = 31_536_000;
export const SECONDS_IN_DAY = 86_400;
export const SECONDS_IN_HOUR = 3_600;

// CoinGecko API key
export const GECKO_KEY = process.env.COINGECKO_API_KEY || '';

export const getRedisID = () => {
  if (!process.env.ENV) {
    throw new Error('ENV environment variable is not specified');
  }

  return process.env.ENV;
};

export const REDISHOST = process.env.REDISHOST || 'localhost';
export const REDISPORT: number = Number(process.env.REDISPORT) || 6379;

export const ALCHEMY_API_KEY = process.env.ALCHEMY_KEY || '';
export const INFURA_API_KEY = process.env.INFURA_KEY || '';

// Testing accounts (todo: remove this when QA over)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isTestingAccount = (address: string): boolean => {
  return true;

  // const testingAccounts = [
  //   '0xb527e950fc7c4f581160768f48b3bfa66a7de1f0',
  //   '0xF8F6B70a36f4398f0853a311dC6699Aba8333Cc1',
  //   '0x0960Da039bb8151cacfeF620476e8bAf34Bd9565',
  //   '0x8DC15493a8041f059f18ddBA98ee7dcf93b838Ad',
  //   '0xbea9419e51bbd1b7f564c9f0891187a5822974ab',
  //   '0xFD4295c1A0b07e6b706f0Ab83dC9eB461b7f17B3',
  // ];

  // return testingAccounts.map((item) => item.toLowerCase()).includes(address.toLowerCase());
};

const factories: { [chainId: string]: string } = {
  1: '0x6a7a5c3824508d03f0d2d24e0482bea39e08ccaf',
  5: '0x9f30Ec6903F1728ca250f48f664e48c3f15038eD',
  42161: '0xda66a7584da7210fd26726efb12585734f7688c1',
  421613: '0xCC39fF9f5413DA2dFB8475a88E3E6C8B190CeAe6',
  43114: '0xda66a7584da7210fd26726EFb12585734F7688c1',
  43113: '0xda66a7584da7210fd26726EFb12585734F7688c1', // same on avalanche and avalanche fuji
};

export const getFactory = (chainId: string): string => {
  if (!Object.keys(factories).includes(chainId)) {
    throw new Error(`Factory is not specified for ${chainId}.`);
  }

  return factories[chainId];
};
