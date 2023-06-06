import { BigNumber, ethers, providers } from 'ethers';

export async function convertGasUnitsToNativeToken(
  provider: providers.Provider,
  gasUnits: number,
): Promise<number> {
  let gasPriceWei = BigNumber.from(0);

  const attempts = 5;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      gasPriceWei = await provider.getGasPrice();
      break;
    } catch (error) {
      if (attempt + 1 === attempts) {
        // todo: sentry
        throw error;
      }
    }
  }

  const gasUnitsToNativeToken = parseFloat(ethers.utils.formatEther(gasPriceWei)) * gasUnits;
  return gasUnitsToNativeToken;
}