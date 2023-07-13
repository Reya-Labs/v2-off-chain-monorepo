import { ethers, providers } from 'ethers';
import { exponentialBackoff } from '../retry';
import { descale } from '../token';

export async function convertGasUnitsToNativeTokenUnits(
  subject: providers.Provider | ethers.Signer,
  gasUnits: number,
): Promise<number> {
  try {
    const gasPriceWei = await exponentialBackoff(() => subject.getGasPrice());

    const gasUnitsToNativeToken = descale(18)(gasPriceWei) * gasUnits;

    return gasUnitsToNativeToken;
  } catch (_) {
    // todo: track
  }

  return 0;
}
