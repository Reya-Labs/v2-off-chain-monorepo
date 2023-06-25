import { GetPoolLpInfoArgs } from '../types';
import { getLpMaxLeverage } from './getLpMaxLeverage';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';

export type GetPoolLpInfoResults = {
  maxLeverage: number;
};

export const getPoolLpInfo = async ({
  ammId,
  fixedHigh,
  fixedLow,
  provider,
}: GetPoolLpInfoArgs): Promise<GetPoolLpInfoResults> => {
  const chainId = (await provider.getNetwork()).chainId;
  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];
  const ammInfo: AMMInfo = await getAmmInfo(ammId);

  const maxLeverage = await getLpMaxLeverage({
    fixedLow,
    fixedHigh,
    marginEngineAddress: ammInfo.marginEngineAddress,
    tokenDecimals: ammInfo.underlyingTokenDecimals,
    peripheryAddress,
    provider,
  });

  return {
    maxLeverage,
  };
};
