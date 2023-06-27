import { BigNumber } from 'ethers';
import { simulateTxExpectError } from '../executeTransaction';
import { createLpParams, getLpTxData } from '../lp';
import {
  GetLpMaxLeverageArgs,
  GetPoolLpInfoArgs,
  GetPoolLpInfoResults,
} from './types';
import { descale, scale } from '../../utils/helpers';
import { getDummyWallet } from '../../utils/getDummyWallet';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { decodeLp } from '../../utils/decodeOutput';

export const getPoolLpInfo = async ({
  ammId,
  fixedHigh,
  fixedLow,
  provider,
}: GetPoolLpInfoArgs): Promise<GetPoolLpInfoResults> => {
  const dummyWallet = getDummyWallet().connect(provider);
  try {
    const maxLeverage = await getLpMaxLeverage({
      ammId,
      fixedLow,
      fixedHigh,
      signer: dummyWallet,
    });

    return {
      maxLeverage,
    };
  } catch (e) {
    return {
      maxLeverage: 1,
    };
  }
};

async function getLpMaxLeverage({
  ammId,
  fixedLow,
  fixedHigh,
  signer,
}: GetLpMaxLeverageArgs): Promise<number> {
  const params = await createLpParams({
    ammId,
    signer,
    notional: 1,
    margin: 0,
    fixedLow,
    fixedHigh,
  });

  const { data, value, chainId } = await getLpTxData(params);
  const { bytesOutput, isError } = await simulateTxExpectError(
    signer,
    data,
    value,
    chainId,
  );

  const im = isError
    ? decodeImFromError(bytesOutput).marginRequirement
    : decodeLp(bytesOutput, true, false, false, true).im;

  if (im.gt(0)) {
    // should always happen, since we connect with dummy account
    const maxLeverage: BigNumber = BigNumber.from(
      scale(params.quoteTokenDecimals)(1),
    )
      .mul(BigNumber.from(10).pow(params.quoteTokenDecimals))
      .div(im);

    return Math.floor(descale(params.quoteTokenDecimals)(maxLeverage));
  }

  return 0;
}
