export type WalletRiskAssessment = {
  accountExternalId: string;
  address: string;
  addressRiskIndicators: AddressRiskIndicatorsEntity[];
  addressSubmitted: string;
  chain: string;
  entities: EntitiesEntity[];
  trmAppUrl: string;
};

export type AddressRiskIndicatorsEntity = {
  category: string;
  categoryId: string;
  categoryRiskScoreLevel: number;
  categoryRiskScoreLevelLabel: string;
  incomingVolumeUsd: string;
  outgoingVolumeUsd: string;
  riskType: string;
  totalVolumeUsd: string;
};

export type EntitiesEntity = {
  category: string;
  categoryId: string;
  entity: string;
  riskScoreLevel: number;
  riskScoreLevelLabel: string;
  trmAppUrl: string;
  trmUrn: string;
};
