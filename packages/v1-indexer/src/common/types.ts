import {
  IrsInstanceEventInfo,
  MarginUpdateEventInfo,
  MintOrBurnEventInfo,
  SwapEventInfo,
  VAMMPriceChangeEventInfo,
} from './event-parsers/types';

export type VammEventType =
  | 'mint'
  | 'burn'
  | 'swap'
  | 'price_change'
  | 'vamm_initialization';
export type MarginEngineEventType = 'margin_update';
export type FactoryEventType = 'irs_pool_deployment';

export type VammEventInfo =
  | MintOrBurnEventInfo
  | SwapEventInfo
  | VAMMPriceChangeEventInfo;
export type MarginEngineEventInfo = MarginUpdateEventInfo;
export type FactoryEventInfo = IrsInstanceEventInfo;
