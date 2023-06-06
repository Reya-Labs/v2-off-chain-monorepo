import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import { pullAllPoolsConfig } from '@voltz-protocol/commons-v2';
import { getRedisClient, getTrustedProxies } from '@voltz-protocol/commons-v2';

export const app = express();

app.use(cors());

app.set('trust proxy', getTrustedProxies());

// Create and use the rate limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // Redis store configuration
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => getRedisClient().call(...args),
  }),
});

app.use(limiter);

app.get('/', (_, res) => {
  res.send('Welcome to Voltz API');
});

app.get('/ip', (req, res) => {
  res.send(req.ip);
});

/**
 * @dev maturity timestamp is represented as a UNIX timestamp in second
 * @dev fixedRate is the VAMM rate (e.g. 1.5 means 1.5%). This can be null
 * if there was not yet a swap executed in the vamm.
 * @dev latestApy is the APY between the last two points recorded by the oracle
 * (e.g. 1.5 means 1.5%). This is not the instant APY. This can be null
 * if there aren't yet two recorder points in the Oracle
 */
app.get('/pools', (req, res) => {
  const process = async () => {
    const pools = await pullAllPoolsConfig();

    const result: {
      chainId: number;
      marketId: string;
      maturityTimestamp: number;
      fixedRate: number | null;
      latestApy: number | null;
    }[] = [];

    for (const pool of pools) {
      console.log('pool');
      result.push({
        chainId: pool.chainId,
        marketId: pool.marketId,
        maturityTimestamp: pool.maturityTimestamp,
        fixedRate: pool.lastFixedRate,
        latestApy: pool.latestApy,
      });
    }

    return result;
  };

  process().then(
    (output) => {
      res.json(output);
    },
    (error) => {
      console.log(`API query failed with message ${(error as Error).message}`);
    },
  );
});
