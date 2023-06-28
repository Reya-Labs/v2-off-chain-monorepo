export type AccountEntry = {
  chainId: number;
  accountId: string;
  owner: string;
};

export type AccountEntryUpdate = {
  owner: string;
};

export const mapRow = (row: any): AccountEntry => ({
  chainId: row.chainId,
  accountId: row.accountId,
  owner: row.owner,
});
