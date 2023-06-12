import { Wallet } from 'ethers';

export function getDummyWallet(): Wallet {
  return new Wallet(
    `0x0000000000000000000000000000000000000000000000000000000000000001`,
  );
}
