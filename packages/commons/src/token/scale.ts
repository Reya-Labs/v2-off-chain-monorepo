import { ethers } from 'ethers';

export const scale = (tokenDecimals: number) => {
  const f = (value: number) => {
    return ethers.BigNumber.from(
      ethers.utils.parseUnits(value.toFixed(tokenDecimals), tokenDecimals),
    );
  };

  return f;
};
