import { Contract } from 'ethers';
import { LpPeripheryParams } from '../types';
import { BigNumber } from 'ethers';
import { decodeInfoPostMint } from '../../common/errors/errorHandling';
import { exponentialBackoff } from '../../common/retry';
import { descale } from '../../common/math/descale';

export type GetMarginRequirementPostLp = {
  peripheryContract: Contract;
  marginEngineContract: Contract;
  walletAddress: string;
  lpPeripheryParams: LpPeripheryParams;
  underlyingTokenDecimals: number;
};

export type GetMarginRequirementPostLpResults = {
  maxMarginWithdrawable: number;
  additionalMargin: number;
};

export const getMarginRequirementPostLp = async ({
  peripheryContract,
  marginEngineContract,
  lpPeripheryParams,
  walletAddress,
  underlyingTokenDecimals,
}: GetMarginRequirementPostLp): Promise<GetMarginRequirementPostLpResults> => {
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
  const currentMargin = (
    await exponentialBackoff(() =>
      marginEngineContract.callStatic.getPosition(
        walletAddress,
        lpPeripheryParams.tickLower,
        lpPeripheryParams.tickUpper,
      ),
    )
  ).margin;

  let additionalMargin = 0;
  const scaledCurrentMargin = descale(currentMargin, underlyingTokenDecimals);
  const scaledMarginRequirement =
    descale(marginRequirement, underlyingTokenDecimals) * 1.01;

  if (scaledMarginRequirement > scaledCurrentMargin) {
    additionalMargin = scaledMarginRequirement - scaledCurrentMargin;
  }

  const maxMarginWithdrawable: number = Math.max(
    0,
    descale(
      currentMargin.sub(marginRequirement).sub(BigNumber.from(1)),
      underlyingTokenDecimals,
    ),
  );

  return {
    additionalMargin,
    maxMarginWithdrawable,
  };
};
