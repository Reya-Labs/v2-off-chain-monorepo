import { BigNumber, Contract, providers, Signer } from 'ethers';
import { SwapPeripheryParams } from '../types/actionArgTypes';
import { decodeInfoPostSwap } from '../../common/errors/errorHandling';
import { descale } from '../../common/math/descale';
import { SupportedChainId } from '../../common/types';
import { roughEstimateSwapGasUnits } from './roughEstimateSwapGasUnits';
import {
  convertGasUnitsToNativeTokenUnits,
  getNativeGasToken,
} from '../../common';
import { tickToFixedRate } from '../../common/math/priceTickConversions';
import { getMarginEngineContract } from '../../common/contract-generators';
import { exponentialBackoff } from '@voltz-protocol/commons-v2';

export type GetInfoPostSwapArgs = {
  peripheryContract: Contract;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  provider: providers.Provider;
  chainId: SupportedChainId;
  signer: Signer;
  swapPeripheryParams: SwapPeripheryParams;
};

export type InfoPostSwap = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  availableNotional: number;
  fee: number;
  slippage: number;
  averageFixedRate: number;
  fixedTokenDeltaBalance: number;
  variableTokenDeltaBalance: number;
  fixedTokenDeltaUnbalanced: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX';
  };
};

// todo: simplify and break down into smaller functions

export const getInfoPostSwap = async ({
  peripheryContract,
  marginEngineAddress,
  underlyingTokenDecimals,
  provider,
  chainId,
  signer,
  swapPeripheryParams,
}: GetInfoPostSwapArgs): Promise<InfoPostSwap> => {
  const tickBefore = await exponentialBackoff(() =>
    peripheryContract.getCurrentTick(marginEngineAddress),
  );
  let tickAfter = 0;
  let marginRequirement: BigNumber = BigNumber.from(0);
  let fee = BigNumber.from(0);
  let availableNotional = BigNumber.from(0);
  let fixedTokenDeltaUnbalanced = BigNumber.from(0);
  let fixedTokenDelta = BigNumber.from(0);

  await peripheryContract.callStatic.swap(swapPeripheryParams).then(
    (result: any) => {
      availableNotional = result[1];
      fee = result[2];
      fixedTokenDeltaUnbalanced = result[3];
      marginRequirement = result[4];
      tickAfter = parseInt(result[5], 10);
      fixedTokenDelta = result[0];
    },
    (error: any) => {
      const result = decodeInfoPostSwap(error);
      marginRequirement = result.marginRequirement;
      tickAfter = result.tick;
      fee = result.fee;
      availableNotional = result.availableNotional;
      fixedTokenDeltaUnbalanced = result.fixedTokenDeltaUnbalanced;
      fixedTokenDelta = result.fixedTokenDelta;
    },
  );

  const fixedRateBefore = tickToFixedRate(tickBefore);
  const fixedRateAfter = tickToFixedRate(tickAfter);

  const fixedRateDelta = fixedRateAfter.subtract(fixedRateBefore);
  const fixedRateDeltaRaw = fixedRateDelta.toNumber();

  const signerAddress = await signer.getAddress();

  const marginEngineContract = getMarginEngineContract(
    marginEngineAddress,
    signer,
  );

  const currentMargin = (
    await exponentialBackoff(() =>
      marginEngineContract.callStatic.getPosition(
        signerAddress,
        swapPeripheryParams.tickLower,
        swapPeripheryParams.tickUpper,
      ),
    )
  ).margin;

  const scaledCurrentMargin = descale(currentMargin, underlyingTokenDecimals);

  const scaledAvailableNotional = descale(
    availableNotional,
    underlyingTokenDecimals,
  );
  const scaledFee = descale(fee, underlyingTokenDecimals);
  const scaledMarginRequirement =
    (descale(marginRequirement, underlyingTokenDecimals) + scaledFee) * 1.01;

  const additionalMargin =
    scaledMarginRequirement > scaledCurrentMargin
      ? scaledMarginRequirement - scaledCurrentMargin
      : 0;

  const averageFixedRate = availableNotional.eq(BigNumber.from(0))
    ? 0
    : fixedTokenDeltaUnbalanced
        .mul(BigNumber.from(1000))
        .div(availableNotional)
        .toNumber() / 1000;

  let swapGasUnits = 0;
  if (Object.values(SupportedChainId).includes(chainId)) {
    swapGasUnits = roughEstimateSwapGasUnits(chainId);
  }

  const gasFeeNativeToken = await convertGasUnitsToNativeTokenUnits(
    provider,
    swapGasUnits,
  );

  const maxMarginWithdrawable = Math.max(
    0,
    descale(
      currentMargin.sub(marginRequirement).sub(BigNumber.from(1)),
      underlyingTokenDecimals,
    ),
  );

  const result: InfoPostSwap = {
    marginRequirement: additionalMargin,
    maxMarginWithdrawable: maxMarginWithdrawable,
    availableNotional:
      scaledAvailableNotional < 0
        ? -scaledAvailableNotional
        : scaledAvailableNotional,
    fee: scaledFee < 0 ? -scaledFee : scaledFee,
    slippage: fixedRateDeltaRaw < 0 ? -fixedRateDeltaRaw : fixedRateDeltaRaw,
    averageFixedRate:
      averageFixedRate < 0 ? -averageFixedRate : averageFixedRate,
    fixedTokenDeltaBalance: descale(fixedTokenDelta, underlyingTokenDecimals),
    variableTokenDeltaBalance: descale(
      availableNotional,
      underlyingTokenDecimals,
    ),
    fixedTokenDeltaUnbalanced: descale(
      fixedTokenDeltaUnbalanced,
      underlyingTokenDecimals,
    ),
    gasFee: {
      value: gasFeeNativeToken,
      token: await getNativeGasToken(provider),
    },
  };

  return result;
};
