const borrowingProtocolIds = [5, 6, 9];

export const isBorrowingProtocol = (protocolId: number) => {
  return borrowingProtocolIds.includes(protocolId);
};
