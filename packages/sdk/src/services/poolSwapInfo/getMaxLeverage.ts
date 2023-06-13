import { BigNumber } from 'ethers';
import { decodeSwapOutput, getSwapTxData } from '../swap';
import { simulateTx } from '../executeTransaction';
import { descale, scale } from '@voltz-protocol/commons-v2';
import { MINUS_ONE_BN, ONE_BN, ZERO_BN } from '../../utils/constants';
import { GetMaxLeverageArgs } from './types';

export const getMaxLeverage = async ({
  isFT,
  chainId,
  tokenDecimals,
  params,
}: GetMaxLeverageArgs): Promise<number> => {
  const { data, value } = await getSwapTxData({
    ...params,
    baseAmount: isFT ? ONE_BN : MINUS_ONE_BN,
    margin: ZERO_BN,
  });
  const bytesOutput = (await simulateTx(params.owner, data, value, chainId))
    .bytesOutput;

  const im = decodeSwapOutput(bytesOutput).im;

  if (im.gt(0)) {
    // should always happen, since we connect with dummy account
    const maxLeverage: BigNumber = BigNumber.from(scale(tokenDecimals)(1))
      .mul(BigNumber.from(10).pow(tokenDecimals))
      .div(im);

    return Math.floor(descale(tokenDecimals)(maxLeverage));
  }

  return 0;
};
