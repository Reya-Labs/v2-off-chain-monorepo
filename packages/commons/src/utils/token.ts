import { ethers } from 'ethers';
import { Address } from './convertLowercase';

export const descale = (tokenDecimals: number) => {
  const f = (value: ethers.BigNumber) => {
    return Number(ethers.utils.formatUnits(value.toString(), tokenDecimals));
  };

  return f;
};

const tokenDetails: {
  [address: Address]: {
    tokenName: Uppercase<string>;
    tokenDecimals: number;
  };
} = {
  // ====== USDC ======
  // mainnet
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    tokenName: 'USDC',
    tokenDecimals: 6,
  },
  // goerli
  '0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c': {
    tokenName: 'USDC',
    tokenDecimals: 6,
  },
  // goerli
  '0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557': {
    tokenName: 'USDC',
    tokenDecimals: 6,
  },
  // goerli
  '0x65afadd39029741b3b8f0756952c74678c9cec93': {
    tokenName: 'USDC',
    tokenDecimals: 6,
  },
  // arbitrum
  '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
    tokenName: 'USDC',
    tokenDecimals: 6,
  },
  // arbitrumGoerli
  '0x72a9c57cd5e2ff20450e409cf6a542f1e6c710fc': {
    tokenName: 'USDC',
    tokenDecimals: 6,
  },
  // ====== DAI ======
  // mainnet
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    tokenName: 'DAI',
    tokenDecimals: 18,
  },
  // goerli
  '0x73967c6a0904aa032c103b4104747e88c566b1a2': {
    tokenName: 'DAI',
    tokenDecimals: 18,
  },
  // goerli
  '0xdc31ee1784292379fbb2964b3b9c4124d8f89c60': {
    tokenName: 'DAI',
    tokenDecimals: 18,
  },
  // arbitrum
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
    tokenName: 'DAI',
    tokenDecimals: 18,
  },
  // arbitrumGoerli
  '0xf556c102f47d806e21e8e78438e58ac06a14a29e': {
    tokenName: 'DAI',
    tokenDecimals: 18,
  },
  // ====== (W)ETH ======
  // mainnet
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    tokenName: 'ETH',
    tokenDecimals: 18,
  },
  // goerli
  '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6': {
    tokenName: 'ETH',
    tokenDecimals: 18,
  },
  // arbitrum
  '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
    tokenName: 'ETH',
    tokenDecimals: 18,
  },
  // arbitrumGoerli
  '0xb83c277172198e8ec6b841ff9bef2d7fa524f797': {
    tokenName: 'ETH',
    tokenDecimals: 18,
  },

  // ====== USDT ======
  // mainnet
  '0xdac17f958d2ee523a2206206994597c13d831ec7': {
    tokenName: 'USDT',
    tokenDecimals: 6,
  },
  // goerli
  '0x79c950c7446b234a6ad53b908fbf342b01c4d446': {
    tokenName: 'USDT',
    tokenDecimals: 6,
  },
  // arbitrum
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
    tokenName: 'USDT',
    tokenDecimals: 6,
  },
  // arbitrumGoerli
  '0x8f30ec9fb348513494ccc1710528e744efa71003': {
    tokenName: 'USDT',
    tokenDecimals: 6,
  },
};

export const getTokenDetails = (
  caseSensitiveAddress: string,
): {
  tokenName: Uppercase<string>;
  tokenDecimals: number;
  tokenDescaler: (value: ethers.BigNumber) => number;
} => {
  const address = caseSensitiveAddress.toLowerCase() as Address;

  if (!Object.keys(tokenDetails).includes(address)) {
    throw new Error(`Token details not found for ${address}.`);
  }

  const { tokenName, tokenDecimals } = tokenDetails[address];

  return {
    tokenName,
    tokenDecimals,
    tokenDescaler: descale(tokenDecimals),
  };
};
