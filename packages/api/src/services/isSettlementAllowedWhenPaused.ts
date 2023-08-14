// list of pools for which settlement is enabled even if they are paused
const PAUSED_POOLS_WITH_ALLOWED_SETTLEMENT: Record<string, boolean> = {
  '1_0x037c8d42972c3c058224a2e51b5cb9b504f75b77_v1': true,
  '1_0xd9a3f015a4ffd645014ec0f43148685be8754737_v1': true,
  '42161_0x3ecf01157e9b1a66197325771b63789d1fb18f1f_v1': true,
};

export const isSettlementAllowedWhenPaused = (poolId: string): boolean => {
  return Boolean(PAUSED_POOLS_WITH_ALLOWED_SETTLEMENT[poolId]);
};
