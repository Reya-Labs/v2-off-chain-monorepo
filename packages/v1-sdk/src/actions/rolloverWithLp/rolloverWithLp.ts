import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  ethers,
} from 'ethers';
import {
  RolloverAndLpArgs,
  RolloverAndLpPeripheryParams,
} from '../types/actionArgTypes';
import { handleLpErrors } from '../lp/handleLpErrors';
import { getPeripheryContract } from '../../common/contract-generators';
import { getRolloverWithLpPeripheryParams } from './getRolloverWithLpPeripheryParams';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateRolloverWithLpGasUnits } from './estimateRolloverWithLpGasUnits';

<<<<<<< HEAD:packages/v1-sdk/src/actions/rolloverWithLp/rolloverWithLp.ts
export const rolloverWithLp = async ({
  addLiquidity,
=======
export const rolloverAndLp = async ({
>>>>>>> 041108f8534a1be201e5cc1c7269c62f942f151d:packages/v1-sdk/src/actions/rolloverAndLp/rolloverAndLp.ts
  fixedLow,
  fixedHigh,
  notional,
  margin,
  underlyingTokenAddress,
  underlyingTokenDecimals,
  tickSpacing,
  chainId,
  peripheryAddress,
  marginEngineAddress,
  provider,
  signer,
  isEth,
  maturedMarginEngineAddress,
  maturedPositionOwnerAddress,
  maturedPositionSettlementBalance,
  maturedPositionTickLower,
  maturedPositionTickUpper,
}: RolloverAndLpArgs): Promise<ContractReceipt> => {
  handleLpErrors({
    notional,
    fixedLow,
    fixedHigh,
  });

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const rolloverAndLpPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  let marginDelta = margin;
  if (isEth && maturedPositionSettlementBalance < margin) {
    marginDelta = maturedPositionSettlementBalance;
    rolloverAndLpPeripheryTempOverrides.value = BigNumber.from(
      margin - maturedPositionSettlementBalance,
    );
  }

  const rolloverAndLpPeripheryParams: RolloverAndLpPeripheryParams =
<<<<<<< HEAD:packages/v1-sdk/src/actions/rolloverWithLp/rolloverWithLp.ts
    getRolloverWithLpPeripheryParams({
      addLiquidity,
=======
    getRolloverAndLpPeripheryParams({
      addLiquidity: notional > 0,
>>>>>>> 041108f8534a1be201e5cc1c7269c62f942f151d:packages/v1-sdk/src/actions/rolloverAndLp/rolloverAndLp.ts
      margin: marginDelta,
      notional,
      fixedLow,
      fixedHigh,
      marginEngineAddress,
      underlyingTokenDecimals,
      tickSpacing,
      maturedMarginEngineAddress,
      maturedPositionOwnerAddress,
      maturedPositionSettlementBalance,
      maturedPositionTickLower,
      maturedPositionTickUpper,
    });

  const estimatedGasUnits: BigNumber = await estimateRolloverWithLpGasUnits(
    peripheryContract,
    rolloverAndLpPeripheryParams,
    rolloverAndLpPeripheryTempOverrides,
  );

  rolloverAndLpPeripheryTempOverrides.gasLimit =
    getGasBuffer(estimatedGasUnits);

  const rolloverAndLpTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .rolloverAndLp(
      rolloverAndLpPeripheryParams,
      rolloverAndLpPeripheryTempOverrides,
    )
    .catch(() => {
      throw new Error('RolloverAndLp Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await rolloverAndLpTransaction.wait();

  return receipt;
};
