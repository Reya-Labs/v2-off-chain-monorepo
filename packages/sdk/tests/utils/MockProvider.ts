import { BaseProvider, Network } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

export class MockProvider extends BaseProvider {
  // Network
  public getNetwork(): Promise<Network> {
    return Promise.resolve({
      name: this._network.name,
      chainId: this._network.chainId,
    });
  }

  // Account
  //abstract getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber>;

  call(): Promise<string> {
    return Promise.resolve('');
  }

  estimateGas(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(1000));
  }

  getGasPrice(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(2).mul(BigNumber.from(10).pow(14))); // 0.0002
  }
}
