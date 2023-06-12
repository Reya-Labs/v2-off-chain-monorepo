import { defaultAbiCoder } from 'ethers/lib/utils';
import { SingleAction } from './types';

/**
 * CommandTypes
 * @description Flags that modify a command's execution
 * @enum {number}
 */
export enum CommandType {
  V2_DATED_IRS_INSTRUMENT_SWAP = 0x00,
  V2_DATED_IRS_INSTRUMENT_SETTLE = 0x01,
  V2_VAMM_EXCHANGE_LP = 0x02,
  V2_CORE_CREATE_ACCOUNT = 0x03,
  V2_CORE_DEPOSIT = 0x04,
  V2_CORE_WITHDRAW = 0x05,
  WRAP_ETH = 0x06,
  TRANSFER_FROM = 0x07,
}

const ABI_DEFINITION: { [key in CommandType]: string[] } = {
  // Voltz Actions
  [CommandType.V2_DATED_IRS_INSTRUMENT_SWAP]: [
    'uint128',
    'uint128',
    'uint32',
    'int256',
    'uint160',
  ],
  [CommandType.V2_DATED_IRS_INSTRUMENT_SETTLE]: [
    'uint128',
    'uint128',
    'uint32',
  ],
  [CommandType.V2_VAMM_EXCHANGE_LP]: [
    'uint128',
    'uint128',
    'uint32',
    'int24',
    'int24',
    'int128',
  ],
  [CommandType.V2_CORE_DEPOSIT]: ['uint128', 'address', 'uint256'],
  [CommandType.V2_CORE_WITHDRAW]: ['uint128', 'address', 'uint256'],
  [CommandType.V2_CORE_CREATE_ACCOUNT]: ['uint128'],

  // Token Actions and Checks
  [CommandType.WRAP_ETH]: ['uint256'],
  [CommandType.TRANSFER_FROM]: ['address', 'address', 'uint160'],
};

export type RouterCommand = {
  type: CommandType;
  encodedInput: string;
};

export function createCommand(
  type: CommandType,
  parameters: any[],
): RouterCommand {
  const encodedInput = defaultAbiCoder.encode(ABI_DEFINITION[type], parameters);
  return { type, encodedInput };
}

export function getCommand(type: CommandType, parameters: any[]): SingleAction {
  const command = createCommand(type, parameters);
  return {
    command: command.type.toString(16).padStart(2, '0'),
    input: command.encodedInput,
  };
}
