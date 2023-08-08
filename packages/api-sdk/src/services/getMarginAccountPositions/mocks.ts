const randomValue = () =>
  (Math.random() * 100 > 50 ? -1 : 1) * Math.random() * (1e7 - 1e3) + 1e3;
const randomValue2 = () => Math.random() * (1e4 - 100) + 100;
const randomDate = () =>
  new Date('2023-09-01').valueOf() -
  (Math.random() * (35 - 5) + 5) * 60 * 60 * 24 * 1000;
const randomDate2 = () =>
  new Date('2023-05-01').valueOf() -
  (Math.random() * (35 - 5) + 5) * 60 * 60 * 24 * 1000;
const randomValue3 = () => parseFloat((Math.random() * 1e2).toFixed(2));
const randomHealth = () => {
  return Math.random() * 100 > 50
    ? 'healthy'
    : Math.random() * 100 > 50
    ? 'danger'
    : 'warning';
};
const randomType = () =>
  Math.random() * 100 > 33
    ? 'LP'
    : Math.random() * 100 > 66
    ? 'Fixed'
    : 'Variable';

const randomChainId = () => {
  const numbers = [1, 5, 42161, 421613, 43114, 43113];
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
};

const randomBoolean = () => (Math.random() * 100 > 50 ? true : false);

function randomMarket() {
  const markets = [
    'Aave V2',
    'Aave V3',
    'Compound',
    'Lido',
    'Rocket',
    'GMX:GLP',
    'SOFR',
  ];
  const randomIndex = Math.floor(Math.random() * markets.length);
  return markets[randomIndex];
}

function randomToken() {
  const tokens = ['eth', 'usdc', 'usdt', 'dai'];
  const randomIndex = Math.floor(Math.random() * tokens.length);
  return tokens[randomIndex];
}

const randomUnderlyingToken = () => ({
  address: '1',
  tokenDecimals: 2,
  priceUSD: randomValue3(),
  name: randomToken(),
});

function generateRandomId(length = 8) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

// The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomPosition = () => ({
  type: randomType(),
  id: generateRandomId(),
  pool: {
    id: '1',
    chainId: randomChainId(),
    market: randomMarket(),
    underlyingToken: randomUnderlyingToken(),
    rateOracle: {
      address: '1',
      protocolId: 1,
    },
    termEndTimestampInMS: randomDate(),
    termStartTimestampInMS: randomDate2(),
    isBorrowing: randomBoolean(),
    isV2: randomBoolean(),
  },
  notional: randomValue2(),
  margin: randomValue2(),
  health: randomHealth(),
  receiving: randomValue3(),
  paying: randomValue3(),
  fixLow: randomValue3(),
  fixHigh: randomValue3(),
  poolCurrentFixedRate: randomValue3(),
  variant: 'active',
  unrealizedPNL: randomValue(),
  realizedPNLTotal: randomValue(),
  realizedPNLFees: randomValue(),
  realizedPNLCashflow: randomValue(),
  unrealizedPNLUSD: randomValue(),
  realizedPNLTotalUSD: randomValue(),
  realizedPNLFeesUSD: randomValue(),
  realizedPNLCashflowUSD: randomValue(),
});

export const getPositionsMock = () =>
  new Array(Math.floor(getRandomIntInclusive(4, 11)))
    .fill(0)
    .map(() => randomPosition()) as never;
