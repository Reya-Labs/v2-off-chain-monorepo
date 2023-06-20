export const PERIPHERY_ADDRESS = (chainId: number): string => {
  switch (chainId) {
    case 1: // mainnet
      return '';
    case 5: // goerli
      return '';
    case 42161: // arbitrum
      return '';
    case 421613: // arbitrum goerli
      return '0x7917ADcd534c78f6901fc8A07d3834b9b47EAf26';
    case 0: // local testing
      return '';
    default:
      throw new Error(`Universal Router not deployed on chain ${chainId}`);
  }
};

export const MAX_POOL_CAP = 1000000;
