export function roughEstimateSwapGasUnits(chainId: number): number {
  switch (chainId) {
    case 1:
    case 5:
      return 550000;

    case 42161:
    case 421613:
      return 1500000;

    case 43114:
    case 43113:
      return 650000;

    default: {
      throw new Error(`Chain ID ${chainId} not supported.`);
    }
  }
}
