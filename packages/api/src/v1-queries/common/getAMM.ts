import {
  pullExistingPoolRow,
  BigQueryPoolRow,
} from '@voltz-protocol/indexer-v1';

export const getAmm = async (
  chainId: number,
  vammAddress: string,
): Promise<BigQueryPoolRow> => {
  // Get AMM
  const amm = await pullExistingPoolRow(vammAddress, chainId);

  if (!amm) {
    throw new Error(`Couldn't fetch AMM with address ${vammAddress}.`);
  }

  return amm;
};
