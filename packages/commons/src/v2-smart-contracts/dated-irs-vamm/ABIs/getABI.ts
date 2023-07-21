import { abi as abiEvents0 } from './event-base.json';
import { abi as abiEvents1 } from './event-changes-21072023.json';

export const getABI = () => {
  return [...abiEvents0, ...abiEvents1];
};
