export type TokenType = 'USDC' | 'DAI' | 'ETH' | 'USDT' | 'VUSD';

export const getTokenName = (address: string): TokenType => {
  // ====== USDC ======
  // mainnet
  if (
    address
      .toLowerCase()
      .includes('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase())
  ) {
    return 'USDC';
  }
  // goerli
  if (
    address
      .toLowerCase()
      .includes('0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C'.toLowerCase())
  ) {
    return 'USDC';
  }
  // goerli
  if (
    address
      .toLowerCase()
      .includes('0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557'.toLowerCase())
  ) {
    return 'USDC';
  }
  // goerli
  if (
    address
      .toLowerCase()
      .includes('0x65afadd39029741b3b8f0756952c74678c9cec93'.toLowerCase())
  ) {
    return 'USDC';
  }
  // arbitrum
  if (
    address
      .toLowerCase()
      .includes('0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'.toLowerCase())
  ) {
    return 'USDC';
  }
  // arbitrumGoerli
  if (
    address
      .toLowerCase()
      .includes('0x72A9c57cD5E2Ff20450e409cF6A542f1E6c710fc'.toLowerCase())
  ) {
    return 'USDC';
  }
  // avalanche
  if (
    address
      .toLowerCase()
      .includes('0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E'.toLowerCase())
  ) {
    return 'USDC';
  }

  // ====== DAI ======
  // mainnet
  if (
    address
      .toLowerCase()
      .includes('0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase())
  ) {
    return 'DAI';
  }
  // goerli
  if (
    address
      .toLowerCase()
      .includes('0x73967c6a0904aa032c103b4104747e88c566b1a2'.toLowerCase())
  ) {
    return 'DAI';
  }
  // goerli
  if (
    address
      .toLowerCase()
      .includes('0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'.toLowerCase())
  ) {
    return 'DAI';
  }
  // arbitrum
  if (
    address
      .toLowerCase()
      .includes('0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'.toLowerCase())
  ) {
    return 'DAI';
  }
  // arbitrumGoerli
  if (
    address
      .toLowerCase()
      .includes('0xf556C102F47d806E21E8E78438E58ac06A14A29E'.toLowerCase())
  ) {
    return 'DAI';
  }

  // ====== (W)ETH ======
  // mainnet
  if (
    address
      .toLowerCase()
      .includes('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.toLowerCase())
  ) {
    return 'ETH';
  }
  // goerli
  if (
    address
      .toLowerCase()
      .includes('0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'.toLowerCase())
  ) {
    return 'ETH';
  }
  // arbitrum
  if (
    address
      .toLowerCase()
      .includes('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'.toLowerCase())
  ) {
    return 'ETH';
  }
  // arbitrumGoerli
  if (
    address
      .toLowerCase()
      .includes('0xb83C277172198E8Ec6b841Ff9bEF2d7fa524f797'.toLowerCase())
  ) {
    return 'ETH';
  }

  // ====== USDT ======
  // mainnet
  if (
    address
      .toLowerCase()
      .includes('0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase())
  ) {
    return 'USDT';
  }
  // goerli
  if (
    address
      .toLowerCase()
      .includes('0x79C950C7446B234a6Ad53B908fBF342b01c4d446'.toLowerCase())
  ) {
    return 'USDT';
  }
  // arbitrum
  if (
    address
      .toLowerCase()
      .includes('0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'.toLowerCase())
  ) {
    return 'USDT';
  }
  // arbitrumGoerli
  if (
    address
      .toLowerCase()
      .includes('0x8F30ec9Fb348513494cCC1710528E744Efa71003'.toLowerCase())
  ) {
    return 'USDT';
  }

  // ====== VUSD ======
  // avalanche fuji
  if (
    address
      .toLowerCase()
      .includes('0x54B868B03c68A1307B24fB0A4b60b18A0714a94C'.toLowerCase())
  ) {
    return 'VUSD';
  }

  throw new Error(`Token name not found for ${address}.`);
};
