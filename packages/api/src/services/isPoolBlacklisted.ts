const BLACKLISTED_POOL_IDS: string[] = [
  '421613_1_1689940800_v2',
  '421613_1_1689940801_v2',
];

export const isPoolBlacklisted = (poolId: string): boolean => {
  if (BLACKLISTED_POOL_IDS.includes(poolId)) {
    return true;
  }
  return false;
};
