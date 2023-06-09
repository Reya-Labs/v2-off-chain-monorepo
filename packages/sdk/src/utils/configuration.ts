// todo: complete when deployed
export const PERIPHERY_ADDRESS = (chainId: number): string => {
  switch (chainId) {
    case 1: // mainnet
      return '';
    case 5: // goerli
      return '';
    case 42161: // arbitrum
      return '';
    case 421613: // arbitrum goerli
      return '';
    case 0: // local testing
      return '';
    default:
      throw new Error(`Universal Router not deployed on chain ${chainId}`);
  }
};

const config: Record<string, { name: string; decimals: number }> = {
  // ====== USDC ======
  // mainnet
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { name: 'USDC', decimals: 6 },
  // goerli
  '0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c': { name: 'USDC', decimals: 6 },
  // goerli
  '0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557': { name: 'USDC', decimals: 6 },
  // arbitrum
  '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': { name: 'USDC', decimals: 6 },
  // arbitrumgoerli
  '0x72a9c57cd5e2ff20450e409cf6a542f1e6c710fc': { name: 'USDC', decimals: 6 },
  // ====== DAI ======
  // mainnet
  '0x6b175474e89094c44da98b954eedeac495271d0f': { name: 'DAI', decimals: 18 },
  // goerli
  '0x73967c6a0904aa032c103b4104747e88c566b1a2': { name: 'DAI', decimals: 18 },
  // goerli 2
  '0xdc31ee1784292379fbb2964b3b9c4124d8f89c60': { name: 'DAI', decimals: 18 },
  // arbitrum
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': { name: 'DAI', decimals: 18 },
  // arbitrumgoerli
  '0xf556c102f47d806e21e8e78438e58ac06a14a29e': { name: 'DAI', decimals: 18 },
  // ====== (W)ETH ======
  // mainnet
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': { name: 'ETH', decimals: 18 },
  // goerli
  '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6': { name: 'ETH', decimals: 18 },
  // arbitrum
  '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': { name: 'ETH', decimals: 18 },
  // arbitrumgoerli
  '0xb83c277172198e8ec6b841ff9bef2d7fa524f797': { name: 'ETH', decimals: 18 },
  // ====== USDT ======
  // mainnet
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { name: 'USDT', decimals: 6 },
  // goerli
  '0x79c950c7446b234a6ad53b908fbf342b01c4d446': { name: 'USDT', decimals: 6 },
  // goerli
  '0xc2c527c0cacf457746bd31b2a698fe89de2b6d49': { name: 'USDT', decimals: 6 },
  // arbitrum
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': { name: 'USDT', decimals: 6 },
  // arbitrumgoerli
  '0x8f30ec9fb348513494ccc1710528e744efa71003': { name: 'USDT', decimals: 6 },
};

export const getTokenInfo = (
  tokenAddress: string,
): { name: string; decimals: number } => {
  if (config[tokenAddress.toLowerCase()]) {
    return config[tokenAddress.toLowerCase()];
  } else {
    throw new Error(`Token address ${tokenAddress} not supported.`);
  }
};
