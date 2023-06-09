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
