import { SupportedChainId } from '../services/provider';

// export const CHAIN_IDS: SupportedChainId[] = [1, 5, 42161, 421613, 43114, 43113];
export const CHAIN_IDS: SupportedChainId[] = [1];

// if we let the indexer run continuously, it will overload the evm endpoint
// hence, we need to enforce some buffer between runs (in milliseconds)
export const INDEXING_BUFFER = 1 * 1000;
