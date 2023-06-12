export type Address = Lowercase<string>;

export const convertLowercaseString = (str: string): Address => {
  return str.toLowerCase() as Address;
};
