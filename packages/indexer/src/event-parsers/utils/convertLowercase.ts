import { Address } from '../../utils/types';

export const convertLowercaseString = (str: string): Address => {
  return str.toLowerCase() as Address;
};
