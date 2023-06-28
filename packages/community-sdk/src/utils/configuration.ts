export const IPFS_LEAVES_CID = 'QmQbcRJHqjJGTzugS3QexDMCdx159EjzAVkygPzUCL2tWP';

const nftAccessPassAddresses: Record<string, string> = {
  ['42161']: '0x0f34c59DF32ba22088E1e8869fC3a34B8622c11E',
  ['421613']: '0xe1ebbd9Fb80d0952F5e7d160446934C20aa8b3Aa',
};

export const getNftAccessPassAddress = (chainId: number): string => {
  const key = chainId.toString();

  if (Object.keys(nftAccessPassAddresses).includes(key)) {
    return nftAccessPassAddresses[key];
  }

  throw new Error(
    `NFT Access Pass address is not available for chain id ${chainId}.`,
  );
};
