export type Address = Lowercase<string>;

export const convertToAddress = (str: string): Address => {
  return str.toLowerCase() as Address;
};
