/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { descale } from '../descale';
import { getProvider } from '../provider/getProvider';
import { getTokensFromLiquidity } from '../services/getTokensFromLiquidity';
import { generateMarginEngineContract } from './generateMarginEngineContract';

export type PositionInfo = {
  variableTokenBalance: number;
  fixedTokenBalance: number;
  notionalProvided: number;
  notionalTraded: number;
  margin: number;
  accumulatedFees: number;
};

export const getPositionInfo = async (
  chainId: number,
  marginEngineAddress: string,
  tokenDecimals: number,
  ownerAddress: string,
  tickLower: number,
  tickUpper: number,
): Promise<PositionInfo> => {
  const provider = getProvider(chainId);
  const marginEngine = generateMarginEngineContract(
    marginEngineAddress,
    provider,
  );
  const descaler = descale(tokenDecimals);

  // Get fresh information about the position
  const freshInfo = await marginEngine.callStatic.getPosition(
    ownerAddress,
    tickLower,
    tickUpper,
  );

  const liquidity = descaler(freshInfo._liquidity);
  const { absVariableTokenDelta: notionalProvided } = getTokensFromLiquidity(
    liquidity,
    tickLower,
    tickUpper,
  );
  const variableTokenBalance = descaler(freshInfo.variableTokenBalance);
  const notionalTraded = Math.abs(variableTokenBalance);

  const fixedTokenBalance = descaler(freshInfo.fixedTokenBalance);

  const accumulatedFees = descaler(freshInfo.accumulatedFees);

  const margin = descaler(freshInfo.margin) - accumulatedFees;

  return {
    variableTokenBalance,
    fixedTokenBalance,
    notionalTraded,
    notionalProvided,
    margin,
    accumulatedFees,
  };
};
