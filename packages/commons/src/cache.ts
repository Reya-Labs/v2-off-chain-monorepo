import { isNull } from './isNull';

export class CacheObject<T> {
  private data: T | null = null;
  private lastRefreshInMS = 0;
  private refreshIntervalInMS: number;

  public constructor({ refreshIntervalInMS }: { refreshIntervalInMS: number }) {
    this.refreshIntervalInMS = refreshIntervalInMS;
  }

  public isCacheValid = () => {
    const now = Date.now().valueOf();

    return (
      !isNull(this.data) &&
      this.lastRefreshInMS + this.refreshIntervalInMS > now
    );
  };

  public read = (): T => {
    return this.data as T;
  };

  public update = (data: T) => {
    this.data = data;
  };
}
