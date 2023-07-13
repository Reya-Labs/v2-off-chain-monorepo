import { ZERO_ADDRESS } from '../constants';
import { Address } from '../address';
import { SupportedChainId } from '../provider';

type ContractType =
  | 'core'
  | 'dated_irs_instrument'
  | 'dated_irs_vamm'
  | 'periphery'
  | 'alpha_pass';

const addresses: Record<SupportedChainId, Record<ContractType, Address>> = {
  1: {
    core: ZERO_ADDRESS,
    dated_irs_instrument: ZERO_ADDRESS,
    dated_irs_vamm: ZERO_ADDRESS,
    periphery: ZERO_ADDRESS,
    alpha_pass: ZERO_ADDRESS,
  },
  5: {
    core: ZERO_ADDRESS,
    dated_irs_instrument: ZERO_ADDRESS,
    dated_irs_vamm: ZERO_ADDRESS,
    periphery: ZERO_ADDRESS,
    alpha_pass: ZERO_ADDRESS,
  },
  42161: {
    core: ZERO_ADDRESS,
    dated_irs_instrument: ZERO_ADDRESS,
    dated_irs_vamm: ZERO_ADDRESS,
    periphery: ZERO_ADDRESS,
    alpha_pass: '0x0f34c59df32ba22088e1e8869fc3a34b8622c11e',
  },
  421613: {
    core: '0x6bb334e672729b63aa7d7c4867d4ebd3f9444ca3',
    dated_irs_instrument: '0xcc22e3862d13f40142c1ccd9294e8ad66f845be2',
    dated_irs_vamm: '0x1d45ddd16ba18fee069adcd85827e71fcd54fc38',
    periphery: '0x7917adcd534c78f6901fc8a07d3834b9b47eaf26',
    alpha_pass: '0xf28e795b214230ba192f7f9167d6cbec2558b00c',
  },
  43114: {
    core: ZERO_ADDRESS,
    dated_irs_instrument: ZERO_ADDRESS,
    dated_irs_vamm: ZERO_ADDRESS,
    periphery: ZERO_ADDRESS,
    alpha_pass: ZERO_ADDRESS,
  },
  43113: {
    core: ZERO_ADDRESS,
    dated_irs_instrument: ZERO_ADDRESS,
    dated_irs_vamm: ZERO_ADDRESS,
    periphery: ZERO_ADDRESS,
    alpha_pass: ZERO_ADDRESS,
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

  const networkAddresses = addresses[chainId as SupportedChainId];
  if (!Object.keys(networkAddresses).includes(contractName)) {
    return `Unspecified address for ${contractName} contract`;
  }

  return networkAddresses[contractName];
};
