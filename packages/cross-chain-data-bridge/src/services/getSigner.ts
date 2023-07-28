import { providers, Wallet, Signer } from 'ethers';

export const getSigner = (
  pk: string,
  provider: providers.JsonRpcProvider,
): Signer => {
  // todo: add check for chainId to be SupportedChainId
  const signer = new Wallet(pk, provider);
  return signer;
};
