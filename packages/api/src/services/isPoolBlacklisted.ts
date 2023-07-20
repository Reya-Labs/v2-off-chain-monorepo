const BLACKLISTED_POOL_IDS: Record<string, boolean> = {
  '421613_1_1689940800_v2': true,
  '421613_1_1689940801_v2': true,
};

export const isPoolBlacklisted = (poolId: string): boolean => {
  return Boolean(BLACKLISTED_POOL_IDS[poolId]);
};
