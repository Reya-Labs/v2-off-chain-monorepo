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
  V2_CORE_DEPOSIT = 0x03,
  V2_CORE_WITHDRAW = 0x04,

  TRANSFER = 0x05,
  WRAP_ETH = 0x06,
  UNWRAP_ETH = 0x07,

  V2_OPEN_ACCOUNT = 0x08, // todo: add in Periphery & modify order
}

const ABI_DEFINITION: { [key in CommandType]: string[] } = {
  // Voltz Actions
  [CommandType.V2_DATED_IRS_INSTRUMENT_SWAP]: [
    'uint128',
    'uint128',
    'uint32',
    'int256',
  ],
  [CommandType.V2_DATED_IRS_INSTRUMENT_SETTLE]: [
    'uint128',
    'uint128',
    'uint32',
  ],
  [CommandType.V2_VAMM_EXCHANGE_LP]: [
    'uint128',
    'uint128',
    'uint256',
    'uint160',
    'uint160',
    'int128',
  ], // todo: complete
  [CommandType.V2_CORE_DEPOSIT]: ['uint128', 'address', 'uint256'],
  [CommandType.V2_CORE_WITHDRAW]: ['uint128', 'address', 'uint256'],
  [CommandType.V2_OPEN_ACCOUNT]: ['uint128'], // todo: complete

  // Token Actions and Checks
  [CommandType.WRAP_ETH]: ['address', 'uint256'],
  [CommandType.UNWRAP_ETH]: ['address', 'uint256'],
  [CommandType.TRANSFER]: ['address', 'address', 'uint256'],
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
