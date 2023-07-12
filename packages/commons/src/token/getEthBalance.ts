import { Signer, providers } from 'ethers';
import { descale } from './descale';
import { exponentialBackoff } from '../retry';

export const getEthBalance = async (
  walletAddress: string,
  subject: providers.Provider | Signer,
): Promise<number> => {
  const currentBalance = await exponentialBackoff(() =>
    subject.getBalance(walletAddress),
  );

  return descale(18)(currentBalance);
};
