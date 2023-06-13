import { providers, BigNumber } from 'ethers';
import { getPeripheryContract } from '../../common/contract-generators';
import { LpPeripheryParams } from '../types';
import { getLpPeripheryParams } from '../lp/getLpPeripheryParams';
import { DEFAULT_TICK_SPACING } from '../../common/constants';
import { decodeInfoPostMint } from '../../common/errors/errorHandling';
import { scale } from '../../common/math/scale';
import { descale } from '../../common/math/descale';

export type GetLpMaxLeverageArgs = {
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  tokenDecimals: number;
  peripheryAddress: string;
  provider: providers.Provider;
};

export const getLpMaxLeverage = async ({
  fixedLow,
  fixedHigh,
  marginEngineAddress,
  tokenDecimals,
  peripheryAddress,
  provider,
}: GetLpMaxLeverageArgs): Promise<number> => {
  const peripheryContract = getPeripheryContract(peripheryAddress, provider);
  const tickSpacing = DEFAULT_TICK_SPACING;

  const lpPeripheryParams: LpPeripheryParams = getLpPeripheryParams({
    margin: 0,
    notional: 1,
    fixedLow,
    fixedHigh,
    marginEngineAddress,
    underlyingTokenDecimals: tokenDecimals,
    tickSpacing,
  });

  let marginRequirement = BigNumber.from('0');

  await peripheryContract.callStatic
    .mintOrBurn(
      lpPeripheryParams.marginEngineAddress,
      lpPeripheryParams.tickLower,
      lpPeripheryParams.tickUpper,
      lpPeripheryParams.notional,
      lpPeripheryParams.isMint,
      lpPeripheryParams.marginDelta,
    )
    .then(
      (result: any) => {
        marginRequirement = BigNumber.from(result);
      },
      (error: any) => {
        const result = decodeInfoPostMint(error);
        marginRequirement = result.marginRequirement;
      },
    );

  if (marginRequirement.gt(0)) {
    // should always happen, since we connect with dummy account
    const maxLeverage: BigNumber = BigNumber.from(scale(1, tokenDecimals))
      .mul(BigNumber.from(10).pow(tokenDecimals))
      .div(marginRequirement);

    return Math.floor(descale(maxLeverage, tokenDecimals));
  }

  return 0;
};
