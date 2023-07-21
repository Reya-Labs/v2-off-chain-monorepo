import { abi as abiFunctions0 } from './function-base.json';
import { abi as abiEvents0 } from './event-base.json';
import { abi as abiEvents1 } from './event-changes-21072023.json';

export const getABI = () => {
  return [...abiFunctions0, ...abiEvents0, ...abiEvents1];
};
