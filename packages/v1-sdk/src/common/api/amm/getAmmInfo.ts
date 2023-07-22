import { AMMInfo } from './types';
import { getPool } from '@voltz-protocol/api-sdk-v2';

export const getAmmInfo = async (ammId: string): Promise<AMMInfo> => {
  const rawAMM = await getPool({ poolId: ammId });

  return {
    isEth: rawAMM.underlyingToken.name === 'eth',
    marginEngineAddress: rawAMM.marginEngineAddress,
    underlyingTokenDecimals: rawAMM.underlyingToken.tokenDecimals,
    underlyingTokenAddress: rawAMM.underlyingToken.address,
  };
};
