import { ZERO_ADDRESS } from '../constants';
import { Address } from '../convertLowercase';

type NetworkAddresses = { [name: string]: Address };

type AllAddresses = { [chainId: string]: NetworkAddresses };

type ContractType = 'core' | 'dated_irs_instrument' | 'dated_irs_vamm';

const addresses: AllAddresses = {
  1: {
    core: ZERO_ADDRESS,
    dated_irs_instrument: ZERO_ADDRESS,
    dated_irs_vamm: ZERO_ADDRESS,
  },
  421613: {
    core: '0x6bb334e672729b63aa7d7c4867d4ebd3f9444ca3',
    dated_irs_instrument: '0xcc22e3862d13f40142c1ccd9294e8ad66f845be2',
    dated_irs_vamm: '0x1d45ddd16ba18fee069adcd85827e71fcd54fc38',
  },
};

export const getAddress = (
  chainId: number,
  contractName: ContractType,
): string => {
  const keyChainId = chainId.toString();
  if (!Object.keys(addresses).includes(keyChainId)) {
    return `Unspecified addresses for chain id ${keyChainId}`;
  }

  const networkAddresses = addresses[keyChainId];
  if (!Object.keys(networkAddresses).includes(contractName)) {
    return `Unspecified address for ${contractName} contract`;
  }

  return networkAddresses[contractName];
};
