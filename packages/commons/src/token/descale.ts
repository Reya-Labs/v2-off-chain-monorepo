import { ethers } from 'ethers';

export const descale = (tokenDecimals: number) => {
  const f = (value: ethers.BigNumber) => {
    return Number(ethers.utils.formatUnits(value.toString(), tokenDecimals));
  };

  return f;
};
