import { AccountEntry } from './types';

export const mapToAccountEntry = (row: any): AccountEntry => ({
  chainId: row.chainId,
  accountId: row.accountId,
  owner: row.owner,
});
