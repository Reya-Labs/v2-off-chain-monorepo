import { SimulateSwapArgs, SwapPeripheryParams } from "../types/actionArgTypes";
import { handleSwapErrors } from "./handleSwapErrors";
import { DEFAULT_TICK_SPACING, PERIPHERY_ADDRESS_BY_CHAIN_ID } from "../../common/constants";
import { BigNumber, ethers, providers, utils } from "ethers";
import { getPeripheryContract } from "../../common/contract-generators";
import { getSwapPeripheryParams } from "./getSwapPeripheryParams";
import getDummyWallet from "../../common/wallet/getDummyWallet";
import { getInfoPostSwap } from "./getInfoPostSwap";


export const simulateSwap = async ({
   isFT,
   isEth,
   notional,
   margin,
   fixedRateLimit,
   fixedLow,
   fixedHigh,
   ammInfo,
   provider,
   signer,
}: SimulateSwapArgs) => {

  if (signer === undefined) {
    signer = getDummyWallet().connect(provider);
  }

  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }

  handleSwapErrors({
    notional,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress: ammInfo.underlyingTokenAddress,
  });

  const signerAddress: string = await signer.getAddress();

  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const chainId: number = await signer.getChainId();

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams({
    margin,
    isFT,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  const swapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  if (isEth && margin > 0) {
    swapPeripheryTempOverrides.value = utils.parseEther(
      margin.toFixed(18).toString(),
    );
  }

  const infoPostSwap = await getInfoPostSwap(
    {
      peripheryContract,
      marginEngineAddress: ammInfo.marginEngineAddress,
      underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
      provider,
      chainId,
      signer,
      swapPeripheryParams
    }
  );

  return infoPostSwap;

}

