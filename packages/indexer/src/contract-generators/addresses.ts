import { ZERO_ADDRESS } from '@voltz-protocol/commons-v2';
import { Address } from '@voltz-protocol/commons-v2';

type NetworkAddresses = { [name: string]: Address };

type AllAddresses = { [chainId: number]: NetworkAddresses };

type ContractType = 'core' | 'dated_irs_instrument' | 'dated_irs_vamm';

const addresses: AllAddresses = {
  1: {
    core: ZERO_ADDRESS,
    dated_irs_instrument: ZERO_ADDRESS,
    dated_irs_vamm: ZERO_ADDRESS,
  },
};

export const getAddress = (
  chainId: number,
  contractName: ContractType,
): string => {
  if (!Object.keys(addresses).includes(chainId.toString())) {
    return `Unspecified addresses for chain id ${chainId}`;
  }

  const networkAddresses = addresses[chainId];

  if (!Object.keys(networkAddresses).includes(contractName)) {
    return `Unspecified address for ${contractName} contract`;
  }

  return networkAddresses[contractName];
};
