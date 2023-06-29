import { ethers, providers } from 'ethers';
import { exponentialBackoff } from '../retry';

export async function convertGasUnitsToNativeTokenUnits(
  subject: providers.Provider | ethers.Signer,
  gasUnits: number,
): Promise<number> {
  try {
    const gasPriceWei = await exponentialBackoff(() => subject.getGasPrice());
    const gasUnitsToNativeToken =
      parseFloat(ethers.utils.formatEther(gasPriceWei)) * gasUnits;
    return gasUnitsToNativeToken;
  } catch (_) {
    // todo: sentry
    return 0;
  }
}
