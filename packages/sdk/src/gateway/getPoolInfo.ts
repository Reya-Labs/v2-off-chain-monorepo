export async function getPoolInfo(ammId: string) {
  return Promise.resolve({
    quoteTokenAddress: '',
    isEth: false,
    quoteTokenDecimals: 18,
  });
}
