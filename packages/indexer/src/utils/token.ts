import { ethers } from 'ethers';

export const getTokenDetails = (
  caseSensitiveAddress: string,
): {
  tokenName: string;
  tokenDecimals: number;
} => {
  const address = caseSensitiveAddress.toLowerCase();

  // ====== USDC ======
  // mainnet
  if (
    address.includes('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase())
  ) {
    return {
      tokenName: 'USDC',
      tokenDecimals: 6,
    };
  }
  // goerli
  if (
    address.includes('0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C'.toLowerCase())
  ) {
    return {
      tokenName: 'USDC',
      tokenDecimals: 6,
    };
  }
  // goerli
  if (
    address.includes('0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557'.toLowerCase())
  ) {
    return {
      tokenName: 'USDC',
      tokenDecimals: 6,
    };
  }
  // goerli
  if (
    address.includes('0x65afadd39029741b3b8f0756952c74678c9cec93'.toLowerCase())
  ) {
    return {
      tokenName: 'USDC',
      tokenDecimals: 6,
    };
  }
  // arbitrum
  if (
    address.includes('0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'.toLowerCase())
  ) {
    return {
      tokenName: 'USDC',
      tokenDecimals: 6,
    };
  }
  // arbitrumGoerli
  if (
    address.includes('0x72A9c57cD5E2Ff20450e409cF6A542f1E6c710fc'.toLowerCase())
  ) {
    return {
      tokenName: 'USDC',
      tokenDecimals: 6,
    };
  }

  // ====== DAI ======
  // mainnet
  if (
    address.includes('0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase())
  ) {
    return {
      tokenName: 'DAI',
      tokenDecimals: 18,
    };
  }
  // goerli
  if (
    address.includes('0x73967c6a0904aa032c103b4104747e88c566b1a2'.toLowerCase())
  ) {
    return {
      tokenName: 'DAI',
      tokenDecimals: 18,
    };
  }
  // goerli
  if (
    address.includes('0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'.toLowerCase())
  ) {
    return {
      tokenName: 'DAI',
      tokenDecimals: 18,
    };
  }
  // arbitrum
  if (
    address.includes('0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'.toLowerCase())
  ) {
    return {
      tokenName: 'DAI',
      tokenDecimals: 18,
    };
  }
  // arbitrumGoerli
  if (
    address.includes('0xf556C102F47d806E21E8E78438E58ac06A14A29E'.toLowerCase())
  ) {
    return {
      tokenName: 'DAI',
      tokenDecimals: 18,
    };
  }

  // ====== (W)ETH ======
  // mainnet
  if (
    address.includes('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.toLowerCase())
  ) {
    return {
      tokenName: 'ETH',
      tokenDecimals: 18,
    };
  }
  // goerli
  if (
    address.includes('0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'.toLowerCase())
  ) {
    return {
      tokenName: 'ETH',
      tokenDecimals: 18,
    };
  }
  // arbitrum
  if (
    address.includes('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'.toLowerCase())
  ) {
    return {
      tokenName: 'ETH',
      tokenDecimals: 18,
    };
  }
  // arbitrumGoerli
  if (
    address.includes('0xb83C277172198E8Ec6b841Ff9bEF2d7fa524f797'.toLowerCase())
  ) {
    return {
      tokenName: 'ETH',
      tokenDecimals: 18,
    };
  }

  // ====== USDT ======
  // mainnet
  if (
    address.includes('0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase())
  ) {
    return {
      tokenName: 'USDT',
      tokenDecimals: 6,
    };
  }
  // goerli
  if (
    address.includes('0x79C950C7446B234a6Ad53B908fBF342b01c4d446'.toLowerCase())
  ) {
    return {
      tokenName: 'USDT',
      tokenDecimals: 6,
    };
  }
  // arbitrum
  if (
    address.includes('0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'.toLowerCase())
  ) {
    return {
      tokenName: 'USDT',
      tokenDecimals: 6,
    };
  }
  // arbitrumGoerli
  if (
    address.includes('0x8F30ec9Fb348513494cCC1710528E744Efa71003'.toLowerCase())
  ) {
    return {
      tokenName: 'USDT',
      tokenDecimals: 6,
    };
  }

  throw new Error(`Token details not found for ${address}.`);
};

export const descale = (tokenDecimals: number) => {
  const f = (value: ethers.BigNumber) => {
    return Number(ethers.utils.formatUnits(value.toString(), tokenDecimals));
  };

  return f;
};
