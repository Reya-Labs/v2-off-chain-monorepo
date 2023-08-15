import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import {
  convertToAddress,
  fetchMultiplePromises,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { getAmm } from './old-v1-queries/common/getAMM';
import { getPortfolioPositionDetails } from './old-v1-queries/get-position-details/getPortfolioPositionDetails';
import { getPositionPnL } from './old-v1-queries/position-pnl/getPositionPnL';
import {
  pullAllChainPools,
  getFixedRates,
  getVariableRates,
  SDKVoyage,
  getChainTradingVolume,
  getChainTotalLiquidity,
  getVoyageBadges,
  getVoyages,
  getWalletVoyages,
} from '@voltz-protocol/indexer-v1';
import { getPortfolioPositions as getPortfolioPositionsV1 } from './old-v1-queries/portfolio-positions/getPortfolioPositions';
import {
  getApyFromTo,
  getLiquidityIndicesAt,
} from '@voltz-protocol/bigquery-v2';
import { getV1V2Pools } from './v1v2-queries/get-pools/getV1V2Pools';
import { getV1V2PortfolioPositions } from './v1v2-queries/get-portfolio-positions/getPortfolioPositions';
import { getV1V2Pool } from './v1v2-queries/get-pools/getV1V2Pool';
import { getV1V2FixedRates } from './v1v2-queries/get-fixed-rates/getV1V2FixedRates';
import { getV1V2VariableRates } from './v1v2-queries/get-fixed-rates/getV1V2VariableRates';
import { getV2Pools } from './v2-queries/get-pools/getV2Pools';
import { getV2PortfolioPositions } from './v2-queries/get-portfolio-positions/getV2PortfolioPositions';
import { getV1V2PortfolioPositionDetails } from './v1v2-queries/get-portfolio-positions/getPortfolioPositionDetails';
import { getV1V2PortfolioPositionsByPool } from './v1v2-queries/get-portfolio-positions/getPortfolioPositionsByPool';
import { getRedisClient } from './services/redis';
import { getEnvironmentV2 } from './services/envVars';
import { getV1V2AvailableNotional } from './v1v2-queries/get-available-notional/getAvailableNotional';
import { getV2TradeInformation } from './v2-queries/get-pools/getTradeInformation';
import { getTrustedProxies } from './services/getTrustedProxies';
import { log } from './logging/log';

export const app = express();

app.use(cors());

app.set('trust proxy', getTrustedProxies());

// Create and use the rate limiter
// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 1000, // Limit each IP to 1000 requests per `window` (here, per 5 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers

//   // Redis store configuration
//   store: new RedisStore({
//     // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
//     sendCommand: (...args: string[]) => getRedisClient().call(...args),
//   }),
// });

// app.use(limiter);

app.get('/', (_, res) => {
  res.send('Welcome to Voltz API');
});

app.get('/ip', (req, res) => {
  res.send(req.ip);
});

app.get('/v1v2-pools/:chainIds', (req, res) => {
  const chainIds = req.params.chainIds.split('&').map((s) => Number(s));

  getV1V2Pools(chainIds).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/v1v2-pool/:id', (req, res) => {
  const poolId = req.params.id;

  getV1V2Pool(poolId).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/v1v2-positions/:chainIds/:ownerAddress', (req, res) => {
  const chainIds = req.params.chainIds.split('&').map((s) => Number(s));
  const ownerAddress = req.params.ownerAddress.toLowerCase();

  getV1V2PortfolioPositions(chainIds, ownerAddress).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/v1v2-position/:positionId', (req, res) => {
  const positionId = req.params.positionId;
  const includeHistory = Boolean(
    req.query.includeHistory &&
      typeof req.query.includeHistory === 'string' &&
      req.query.includeHistory.toLowerCase() === 'true',
  );

  getV1V2PortfolioPositionDetails({
    positionId,
    includeHistory,
  }).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/v1v2-trader-positions-by-pool/:poolId/:ownerAddress', (req, res) => {
  const poolId = req.params.poolId.toLowerCase();
  const ownerAddress = req.params.ownerAddress.toLowerCase();

  getV1V2PortfolioPositionsByPool(poolId, ownerAddress, 'trader').then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/v1v2-lp-positions-by-pool/:poolId/:ownerAddress', (req, res) => {
  const poolId = req.params.poolId.toLowerCase();
  const ownerAddress = req.params.ownerAddress.toLowerCase();

  getV1V2PortfolioPositionsByPool(poolId, ownerAddress, 'lp').then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get(
  '/v1v2-fixed-rates/:poolId/:startTimestamp/:endTimestamp',
  (req, res) => {
    const poolId = req.params.poolId;
    const startTimestamp = Number(req.params.startTimestamp);
    const endTimestamp = Number(req.params.endTimestamp);

    getV1V2FixedRates(poolId, startTimestamp, endTimestamp).then(
      (output) => {
        res.json(output);
      },
      (error) => {
        log(`API query failed with message ${(error as Error).message}`);
      },
    );
  },
);

app.get(
  '/v1v2-variable-rates/:poolId/:startTimestamp/:endTimestamp',
  (req, res) => {
    const poolId = req.params.poolId;
    const startTimestamp = Number(req.params.startTimestamp);
    const endTimestamp = Number(req.params.endTimestamp);

    getV1V2VariableRates(poolId, startTimestamp, endTimestamp).then(
      (output) => {
        res.json(output);
      },
      (error) => {
        log(`API query failed with message ${(error as Error).message}`);
      },
    );
  },
);

app.get('/v1v2-available-notional/:poolId', (req, res) => {
  const poolId = req.params.poolId;

  getV1V2AvailableNotional(poolId).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

// V2 only

app.get('/v2-pools/:chainIds', (req, res) => {
  const chainIds = req.params.chainIds.split('&').map((s) => Number(s));

  getV2Pools(chainIds).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/v2-positions/:chainIds/:ownerAddress', (req, res) => {
  const chainIds = req.params.chainIds.split('&').map((s) => Number(s));
  const ownerAddress = req.params.ownerAddress.toLowerCase();

  getV2PortfolioPositions(chainIds, ownerAddress).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/v2-trade-information/:poolId/:base', (req, res) => {
  const poolId = req.params.poolId;
  const base = Number(req.params.base);

  getV2TradeInformation(poolId, base).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

// V2 rate oracle queries

app.get(
  '/v2-liquidity-index/:chainId/:oracleAddress/:timestamp',
  (req, res) => {
    const chainId = Number(req.params.chainId);
    const oracleAddress = convertToAddress(req.params.oracleAddress);
    const timestamp = Number(req.params.timestamp);

    getLiquidityIndicesAt(getEnvironmentV2(), chainId, oracleAddress, [
      timestamp,
    ]).then(
      ([output]) => {
        res.json(output);
      },
      (error) => {
        log(`API query failed with message ${(error as Error).message}`);
      },
    );
  },
);

app.get(
  '/v2-variable-apy-from-to/:chainId/:oracleAddress/:from/:to',
  (req, res) => {
    const chainId = Number(req.params.chainId);
    const oracleAddress = convertToAddress(req.params.oracleAddress);
    const from = Number(req.params.from);
    const to = Number(req.params.to);

    getApyFromTo(getEnvironmentV2(), chainId, oracleAddress, from, to).then(
      (output) => {
        res.json(output);
      },
      (error) => {
        log(`API query failed with message ${(error as Error).message}`);
      },
    );
  },
);

app.get('/v2-variable-apy-from/:chainId/:oracleAddress/:from', (req, res) => {
  const chainId = Number(req.params.chainId);
  const oracleAddress = convertToAddress(req.params.oracleAddress);
  const from = Number(req.params.from);
  const to = getTimestampInSeconds();

  getApyFromTo(getEnvironmentV2(), chainId, oracleAddress, from, to).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

// V1-only support [PRESERVE BELOW FOR BACKWARDS COMPATABILITY]

app.get('/pool/:chainId/:vammAddress', (req, res) => {
  const chainId = Number(req.params.chainId);
  const vammAddress = req.params.vammAddress.toLowerCase();

  getAmm(chainId, vammAddress).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

// todo: move this to function
app.get('/chain-information/:chainIds', (req, res) => {
  const process = async () => {
    const chainIds = req.params.chainIds.split('&').map((s) => Number(s));

    const { data, isError } = await fetchMultiplePromises([
      getChainTradingVolume(chainIds),
      getChainTotalLiquidity(chainIds),
    ]);

    if (isError) {
      return {
        volume30Day: 0,
        totalLiquidity: 0,
      };
    }

    const [volume30Day, totalLiquidity] = data;

    return {
      volume30Day,
      totalLiquidity,
    };
  };

  process().then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/all-pools/:chainIds', (req, res) => {
  const chainIds = req.params.chainIds.split('&').map((s) => Number(s));

  pullAllChainPools(chainIds).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/portfolio-positions/:chainIds/:ownerAddress', (req, res) => {
  const chainIds = req.params.chainIds.split('&').map((s) => Number(s));
  const ownerAddress = req.params.ownerAddress;

  getPortfolioPositionsV1(chainIds, ownerAddress).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

app.get('/portfolio-position-details/:positionId', (req, res) => {
  const positionId = req.params.positionId;
  const includeHistory = Boolean(
    req.query.includeHistory &&
      typeof req.query.includeHistory === 'string' &&
      req.query.includeHistory.toLowerCase() === 'true',
  );

  getPortfolioPositionDetails({
    positionId,
    includeHistory,
  }).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

// todo: deprecate when SDK stops consuming it
app.get(
  '/position-pnl/:chainId/:vammAddress/:ownerAddress/:tickLower/:tickUpper',
  (req, res) => {
    const chainId = Number(req.params.chainId);
    const vammAddress = req.params.vammAddress;
    const ownerAddress = req.params.ownerAddress;
    const tickLower = Number(req.params.tickLower);
    const tickUpper = Number(req.params.tickUpper);

    getPositionPnL(
      chainId,
      vammAddress,
      ownerAddress,
      tickLower,
      tickUpper,
    ).then(
      (output) => {
        res.json(output);
      },
      (error) => {
        log(`API query failed with message ${(error as Error).message}`);
      },
    );
  },
);

app.get(
  '/fixed-rates/:chainId/:vammAddress/:startTimestamp/:endTimestamp',
  (req, res) => {
    const chainId = Number(req.params.chainId);
    const vammAddress = req.params.vammAddress;
    const startTimestamp = Number(req.params.startTimestamp);
    const endTimestamp = Number(req.params.endTimestamp);

    getFixedRates(chainId, vammAddress, startTimestamp, endTimestamp).then(
      (output) => {
        res.json(output);
      },
      (error) => {
        log(`API query failed with message ${(error as Error).message}`);
      },
    );
  },
);

app.get(
  '/variable-rates/:chainId/:rateOracleAddress/:startTimestamp/:endTimestamp',
  (req, res) => {
    const chainId = Number(req.params.chainId);
    const rateOracleAddress = req.params.rateOracleAddress;
    const startTimestamp = Number(req.params.startTimestamp);
    const endTimestamp = Number(req.params.endTimestamp);

    getVariableRates(
      chainId,
      rateOracleAddress,
      startTimestamp,
      endTimestamp,
    ).then(
      (output) => {
        res.json(output);
      },
      (error) => {
        log(`API query failed with message ${(error as Error).message}`);
      },
    );
  },
);

app.get('/voyage/:chainId/:ownerAddress', (req, res) => {
  const ownerAddress = req.params.ownerAddress.toLowerCase();

  getVoyageBadges(ownerAddress).then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});

// todo: move this to function
app.get('/voyage-V1/:chainId/:walletAddress', (req, res) => {
  log(`Requesting information about Voyage Badges`);

  const process = async () => {
    const voyages = await getVoyages();

    const chainId = Number(req.params.chainId);
    const walletAddress = req.params.walletAddress.toLowerCase();
    const walletVoyages = await getWalletVoyages(chainId, walletAddress);

    const result: SDKVoyage[] = [];
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const inTransitPeriod = 3 * 60 * 60; // 3 hours

    for (const voyage of voyages) {
      let status: 'achieved' | 'notAchieved' | 'notStarted' | 'inProgress';
      let timestampInMS: number | null = null;
      if (currentTimestamp < voyage.startTimestamp) {
        status = 'notStarted';
      } else if (currentTimestamp < voyage.endTimestamp + inTransitPeriod) {
        status = 'inProgress';
      } else if (!walletVoyages.includes(voyage.id)) {
        status = 'notAchieved';
      } else {
        status = 'achieved';
        timestampInMS = voyage.endTimestamp * 1000;
      }

      result.push({
        id: voyage.id,
        status,
        timestamp: timestampInMS,
      });
    }

    return result;
  };

  process().then(
    (output) => {
      res.json(output);
    },
    (error) => {
      log(`API query failed with message ${(error as Error).message}`);
    },
  );
});
