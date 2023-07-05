import { BigNumber, ContractReceipt } from 'ethers';
import {
  Transaction,
  estimateGas,
  executeTransaction,
  simulateTxExpectError,
} from '../executeTransaction';
import { CompleteEditLpDetails, EditLpArgs } from './types';
import { InfoPostLp } from '../lp';
import { encodeLp } from '../lp/encode';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { decodeLp } from '../../utils/decodeOutput';
import {
  convertGasUnitsToNativeTokenUnits,
  getLiquidityFromBase,
  getNativeGasToken,
  descale,
  scale,
} from '@voltz-protocol/commons-v2';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { ZERO_BN } from '../../utils/constants';

export async function editLp({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<ContractReceipt> {
  const params = await createEditLpParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeLp(params, params.accountId);
  const result = await executeTransaction(signer, data, value, params.chainId);
  return result;
}

export async function simulateEditLp({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<InfoPostLp> {
  const params = await createEditLpParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeLp(params, params.accountId);
  let txData: Transaction & { gasLimit: BigNumber };
  let bytesOutput: any;
  let isError = false;

  try {
    const res = await simulateTxExpectError(
      signer,
      data,
      value,
      params.chainId,
    );

    txData = res.txData;
    bytesOutput = res.bytesOutput;
    isError = res.isError;
  } catch (e) {
    return {
      gasFee: {
        value: -1,
        token: 'ETH',
      },
      fee: -1,
      marginRequirement: -1,
      maxMarginWithdrawable: -1,
    };
  }

  const { fee, im } = isError
    ? { im: decodeImFromError(bytesOutput).marginRequirement, fee: ZERO_BN }
    : decodeLp(margin < 0 ? bytesOutput[1] : bytesOutput[2]);

  const price = await convertGasUnitsToNativeTokenUnits(
    signer,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: getNativeGasToken(params.chainId),
  };

  const marginRequirement = descale(params.quoteTokenDecimals)(im);

  const result = {
    gasFee: gasFee,
    fee: descale(params.quoteTokenDecimals)(fee),
    marginRequirement,
    maxMarginWithdrawable: params.positionMargin - marginRequirement,
  };

  return result;
}

export async function estimateEditLpGasUnits({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<BigNumber> {
  const params = await createEditLpParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeLp(params, params.accountId);
  const estimate = await estimateGas(signer, data, value, params.chainId);

  return estimate.gasLimit;
}

export async function getEditLpInfo(
  args: Omit<EditLpArgs, 'margin'>,
): Promise<InfoPostLp> {
  return simulateEditLp({
    ...args,
    margin: 0,
  });
}

async function createEditLpParams({
  positionId,
  signer,
  notional,
  margin,
}: EditLpArgs): Promise<CompleteEditLpDetails> {
  const lpInfo = await getPositionInfo(positionId);
  const chainId = await signer.getChainId();

  if (lpInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  const base = notional / lpInfo.currentLiquidityIndex;
  const liquidityAmount = getLiquidityFromBase(
    base,
    lpInfo.tickLower,
    lpInfo.tickUpper,
  );

  const params: CompleteEditLpDetails = {
    ...lpInfo,
    ownerAddress: await signer.getAddress(),
    liquidityAmount: scale(lpInfo.quoteTokenDecimals)(liquidityAmount),
    margin: scale(lpInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(lpInfo.quoteTokenDecimals)(0),
  };

  console.log('edit lp params:', params);

  return params;
}
