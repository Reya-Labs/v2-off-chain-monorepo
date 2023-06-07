import { BigNumber, Contract } from "ethers";
import { SwapPeripheryParams } from "../types/actionArgTypes";
import { exponentialBackoff } from "../../common/retry";
import { decodeInfoPostSwap } from "../../common/errors/errorHandling";


export type GetInfoPostSwapArgs = {
  peripheryContract: Contract;
  marginEngineAddress: string;
  swapPeripheryParams: SwapPeripheryParams;
}

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
}


export const getInfoPostSwap = async ({
  peripheryContract,
  marginEngineAddress,
  swapPeripheryParams
}
: GetInfoPostSwapArgs): Promise<InfoPostSwap> => {

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

  const scaledAvailableNotional = descale(availableNotional);
  const scaledFee = descale(fee);
  const scaledMarginRequirement = (descale(marginRequirement) + scaledFee) * 1.01;

  const additionalMargin =
    scaledMarginRequirement > scaledCurrentMargin
      ? scaledMarginRequirement - scaledCurrentMargin
      : 0;

  const averageFixedRate = availableNotional.eq(BigNumber.from(0))
    ? 0
    : fixedTokenDeltaUnbalanced.mul(BigNumber.from(1000)).div(availableNotional).toNumber() /
    1000;

  let swapGasUnits = 0;
  const chainId = await wallet.getChainId();
  if (Object.values(SupportedChainId).includes(chainId)) {
    swapGasUnits = estimateSwapGasUnits(chainId);
  }

  const gasFeeNativeToken = await convertGasUnitsToNativeToken(this.provider, swapGasUnits);

  const maxMarginWithdrawable = Math.max(
    0,
    descale(currentMargin.sub(marginRequirement).sub(BigNumber.from(1))),
  );


  const result: InfoPostSwap = {

  }

  return result;

}