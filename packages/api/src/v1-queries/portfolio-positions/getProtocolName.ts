export const getProtocolName = (
  protocolId: number,
):
  | 'Aave V2'
  | 'Aave V3'
  | 'Compound'
  | 'Lido'
  | 'Rocket'
  | 'GMX:GLP'
  | 'SOFR' => {
  if (protocolId === 1) {
    return 'Aave V2';
  }

  if (protocolId === 2) {
    return 'Compound';
  }

  if (protocolId === 3) {
    return 'Lido';
  }

  if (protocolId === 4) {
    return 'Rocket';
  }

  if (protocolId === 5) {
    return 'Aave V2';
  }

  if (protocolId === 6) {
    return 'Compound';
  }

  if (protocolId === 7) {
    return 'Aave V3';
  }

  if (protocolId === 8) {
    return 'GMX:GLP';
  }

  if (protocolId === 9) {
    return 'Aave V3';
  }

  if (protocolId === 10) {
    return 'SOFR';
  }

  throw new Error(`Unrecognized protocol ${protocolId}`);
};

export const isBorrowingProtocol = (protocolId: number) => {
  return protocolId === 6 || protocolId === 5 || protocolId === 9;
};
