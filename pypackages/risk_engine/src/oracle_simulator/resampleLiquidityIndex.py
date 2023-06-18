import pandas as pd


def resample_liquidity_index(liquidity_index_df: pd.DataFrame, resampling_frequency: str='1D'):
    liquidity_index_df.loc[:, "liquidityIndex"] = liquidity_index_df.loc[:, "liquidityIndex"].astype(float) / 10 ** 27
    liquidity_index_df.index = pd.to_datetime(liquidity_index_df.loc[:, "timestamp"], unit='s')
    liquidity_index_df = liquidity_index_df.loc[:, ["liquidityIndex"]]
    liquidity_index_df = liquidity_index_df.astype(float)

    oidx = liquidity_index_df.index
    nidx = pd.date_range(oidx.min(), oidx.max(), freq=resampling_frequency)
    liquidity_index_df_interpolated = liquidity_index_df.reindex(oidx.union(nidx)).interpolate(method='linear').reindex(nidx)

    return liquidity_index_df_interpolated
