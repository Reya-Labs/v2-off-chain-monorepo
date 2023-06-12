import { SECONDS_IN_DAY } from '../../../../common/constants';
import { BigQueryHistoricalRateRow } from '../../../types';

export const find24HourDatapoint = (
  datapoints: BigQueryHistoricalRateRow[],
): BigQueryHistoricalRateRow => {
  const latestDatapoint = datapoints[0];

  const closeTo24Hr = (i: number) => {
    return Math.abs(
      datapoints[i].timestamp - latestDatapoint.timestamp - SECONDS_IN_DAY,
    );
  };

  let j = 0;
  for (let i = 0; i < datapoints.length; i++) {
    if (closeTo24Hr(i) < closeTo24Hr(j)) {
      j = i;
    }
  }

  return datapoints[j];
};
