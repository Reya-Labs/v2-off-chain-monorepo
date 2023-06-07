import { BigNumber, Contract } from "ethers";


export type GetInfoPostSwapArgs = {
  peripheryContract: Contract;
  marginEngineAddress: string;
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
  marginEngineAddress
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





}