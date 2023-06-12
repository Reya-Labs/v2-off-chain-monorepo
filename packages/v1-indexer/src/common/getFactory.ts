const factories: { [chainId: string]: string } = {
  1: '0x6a7a5c3824508d03f0d2d24e0482bea39e08ccaf',
  5: '0x9f30Ec6903F1728ca250f48f664e48c3f15038eD',
  42161: '0xda66a7584da7210fd26726efb12585734f7688c1',
  421613: '0xCC39fF9f5413DA2dFB8475a88E3E6C8B190CeAe6',
  43114: '0xda66a7584da7210fd26726EFb12585734F7688c1',
  43113: '0xda66a7584da7210fd26726EFb12585734F7688c1', // same on avalanche and avalanche fuji
};

export const getFactory = (chainId: string): string => {
  if (!Object.keys(factories).includes(chainId)) {
    throw new Error(`Factory is not specified for ${chainId}.`);
  }

  return factories[chainId];
};
